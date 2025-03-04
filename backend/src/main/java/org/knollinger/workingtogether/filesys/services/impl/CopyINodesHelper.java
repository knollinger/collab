package org.knollinger.workingtogether.filesys.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.models.INode;
import org.knollinger.workingtogether.utils.services.IDbService;

/**
 * INodes zu kopieren ist ein komplexer Vorgang. Und eine Liste von INodes macht das nicht besser...
 * 
 * <ul>
 * <li> 
 *      Wenn die zu kopierene INode ein Directory ist, muss eine entsprechende Dir-Node im 
 *      Ziel-Folder angelegt werden. Danach geht der ganze Käse mit der neu angelegten Node
 *      als Ziel und all Ihren Kinderns als Source weiter. Und dann das ganze rekursiv....
 * </li>
 * <li>
 *      Wenn die zu kopierende INode <b>kein</b> Directory ist, so ist der INode-Record zu
 *      kopieren und der dazu gehörige Blob!
 * </li> 
 * </ul>
 */
public class CopyINodesHelper
{
    private static final String SQL_COPY_INODE = "" //
        + "insert into inodes  ( name, created, modified, size, type, hash, parent, uuid)" //
        + "  select name , created, modified, size, type, hash, '?', '?'" //
        + "    from inodes" //
        + "        where uuid=?";

    private IDbService dbSvc;

    public CopyINodesHelper(IDbService dbService)
    {
        this.dbSvc = dbService;
    }

    public void copyINodes(List<INode> inodes, INode target) throws TechnicalFileSysException
    {
        Connection conn = null;

        try
        {
            conn = this.dbSvc.openConnection();
            conn.setAutoCommit(false);

            this.copyINodes(inodes, target);

            conn.commit();
        }
        catch (SQLException e)
        {
            throw new TechnicalFileSysException(
                "Die Dateisystem-Objekte konnten aufgrund eines technischen Problems nicht kopiert werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     * 
     * @param inodes
     * @param target
     * @param conn
     */
    private void copyINodes(List<INode> inodes, INode target, Connection conn)
    {
        for (INode iNode : inodes)
        {
            if (iNode.isDirectory())
            {
                this.copyDirectory(iNode, target, conn);
            }
            else
            {
                this.copyFileINode(iNode, target, conn);
            }
        }
    }

    /**
     * 
     * @param iNode
     * @param target
     * @param conn
     */
    private void copyFileINode(INode iNode, INode target, Connection conn)
    {
        // TODO Auto-generated method stub

    }

    /**
     * 
     * @param iNode
     * @param target
     * @param conn
     */
    private void copyDirectory(INode iNode, INode target, Connection conn)
    {
        // TODO Auto-generated method stub
    }

    private INode cloneINode(INode source, INode target, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;

        try
        {
            UUID newUUID = UUID.randomUUID();

            stmt = conn.prepareStatement(SQL_COPY_INODE);
            stmt.setString(1, target.getUuid().toString());
            stmt.setString(2, newUUID.toString());
            stmt.setString(3, source.getUuid().toString());
            stmt.executeUpdate();
            
//            conn.pre

            Timestamp now = new Timestamp(System.currentTimeMillis());
            return INode.builder() //
                .uuid(newUUID) //
                .parent(target.getUuid()) //
                .name(source.getName()) //
                .created(now) //
                .modified(now) //
                .type(source.getType()) //
                .size(source.getSize()) //
                .build();
        }
        finally
        {
            this.dbSvc.closeQuitely(stmt);
        }
    }
}
