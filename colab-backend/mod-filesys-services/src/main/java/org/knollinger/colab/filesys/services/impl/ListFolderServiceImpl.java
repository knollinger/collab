package org.knollinger.colab.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.services.IListFolderService;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.models.ACLEntry;
import org.knollinger.colab.permissions.models.EACLEntryType;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ListFolderServiceImpl implements IListFolderService
{
    private static final String SQL_GET_ALL_CHILDS = """
        select `i`.`uuid`, `i`.`name`, `i`.`parent`, `i`.`linkTo`, `i`.`size`, `i`.`type`, `i`.`created`, `i`.`modified`, `a`.`ownerId`, `a`.`groupId`, `e`.`ownerId`, `e`.`ownerType`, `e`.`perms`
        from `inodes` i
            left join `acls` a
                on `i`.`uuid` = `a`.`resourceId`
                    left join `acl_entries` e
                        on `a`.`resourceId` = `e`.`resourceId`
                            where `i`.`parent`=?
        order by `i`.`name`
        """;

    private static final String ERR_LIST_FOLDER = "Der Inhalt des Ordners '%1$s' konnte nicht gelesen werden.";

    @Autowired
    private IDbService dbSvc;

    @Autowired()
    private IPermissionsService permsSvc;

    private FileSysUtils fileSysUtils = new FileSysUtils();

    /**
     *
     */
    @Override
    public List<INode> getAllChilds(INode parent)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        return this.getAllChilds(parent.getUuid());
    }

    /**
     *
     */
    @Override
    public List<INode> getAllChilds(UUID parentId)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {

        try (Connection conn = this.dbSvc.openConnection())
        {
            return this.getAllChilds(parentId, conn);
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(String.format(ERR_LIST_FOLDER, parentId), e);
        }
    }

    /**
     * 
     */
    @Override
    public List<INode> getAllChilds(INode parent, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {        return this.getAllChilds(parent.getUuid(), conn);
    }

    /**
     * 
     */
    @Override
    public List<INode> getAllChilds(UUID parentId, Connection conn)
        throws TechnicalFileSysException, NotFoundException, AccessDeniedException
    {
        // TODO: parentFolder auflösen!
        UUID resolvedUUID = this.fileSysUtils.resolveLink(parentId, conn);
        INode resolvedParent = this.fileSysUtils.getINode(resolvedUUID, conn);

        if (!this.permsSvc.canEffectiveRead(resolvedParent.getAcl()))
        {
            throw new AccessDeniedException(resolvedParent);
        }

        // Das ResultSet besteht aus einem Select mit zwei left-joins:
        //    * Die Eigentlichen INodes
        //    * für jede INode die ACL
        //    * für jede ACL die ACL-Entries
        //
        // Wir holen also unsere alten COBOL-Gruppenwechsel-Skills raus und fummeln das alles zusammen :-)

        try (PreparedStatement stmt = conn.prepareStatement(SQL_GET_ALL_CHILDS))
        {
            stmt.setString(1, resolvedParent.getUuid().toString());
            try (ResultSet rs = stmt.executeQuery())
            {
                List<INode> childs = new ArrayList<>();
                List<ACLEntry> aclEntries = new ArrayList<>();
                ACL.ACLBuilder currACLBuilder = null;
                INode.INodeBuilder currNodeBuilder = null;
                UUID currUUID = null;

                while (rs.next())
                {
                    UUID uuid = UUID.fromString(rs.getString("i.uuid"));
                    if (currUUID == null || !uuid.equals(currUUID))
                    {
                        if (currUUID != null)
                        {
                            currACLBuilder.entries(aclEntries);
                            aclEntries = new ArrayList<>();
                            currNodeBuilder.acl(currACLBuilder.build());
                            childs.add(currNodeBuilder.build());
                        }
                        currUUID = uuid;
                        currNodeBuilder = INode.builder();
                        currACLBuilder = ACL.builder();

                        currNodeBuilder.uuid(uuid) //
                            .parent(parentId) //
                            .linkTo(this.fileSysUtils.parseNullableUUID(rs.getString("linkTo"))) //
                            .name(rs.getString("i.name")) //
                            .type(rs.getString("i.type")) //
                            .size(rs.getLong("i.size")) //
                            .created(rs.getTimestamp("i.created")) //
                            .modified(rs.getTimestamp("i.modified"));

                        currACLBuilder//
                            .ownerId(UUID.fromString(rs.getString("a.ownerId"))) //
                            .groupId(UUID.fromString(rs.getString("a.groupId")));
                    }

                    ACLEntry entry = ACLEntry.builder() //
                        .uuid(UUID.fromString(rs.getString("e.ownerId"))) //
                        .type(EACLEntryType.valueOf(rs.getString("e.ownerType"))) //
                        .perms(rs.getInt("e.perms")) //
                        .build();
                    aclEntries.add(entry);
                }

                if (currNodeBuilder != null)
                {
                    currACLBuilder.entries(aclEntries);
                    currNodeBuilder.acl(currACLBuilder.build());
                    childs.add(currNodeBuilder.build());
                }

                return childs;
            }
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(String.format(ERR_LIST_FOLDER, parentId), e);
        }
    }
}
