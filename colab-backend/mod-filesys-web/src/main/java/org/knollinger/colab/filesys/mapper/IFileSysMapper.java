package org.knollinger.colab.filesys.mapper;

import java.util.List;

import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.models.INode;
import org.mapstruct.Mapper;

/**
 * Der FileSysMapper ist ein wenig speziell.
 * 
 * Im INodeDTO will ich die effectivePerms haben, diese werden direct aus den
 * INode-Perms und der UserId/Gruppen-Mitgliedschaft des aktuellen Benutzers 
 * berechnet.
 * 
 * Im INode-Objekt will ich die aber nicht haben, es gibt tausen Stellen wo diese 
 * ansonsten berechnet werden müssten.
 * 
 * Der Mapper wird also als abstract class implementiert, alle zu generierenden 
 * Methoden werden ebenfalls als abstract definiert. 
 * 
 * Auf diese Weise können wir hier den ICheckPermsService injecten, der berechnet
 * uns dann die effectivePerms für die Transformation von INode -> INodeDTO.
 * 
 * Alle anderen Methoden bleiben abstract, werden also durch MapStruct generiert
 * und benutzen die Transformation INode->INodeDTO.
 * 
 */
@Mapper(componentModel = "spring")
public interface IFileSysMapper
{
    /**
     * 
     * @param dto
     * @return
     */
    public INode fromDTO(INodeDTO dto);

    /**
     * 
     * @param inode
     * @return
     */
    public INodeDTO toDTO(INode inode);

    /**
     * 
     * @param dtos
     * @return
     */
    public List<INode> fromDTO(List<INodeDTO> dtos);

    /**
     * 
     * @param inodes
     * @return
     */
    public List<INodeDTO> toDTO(List<INode> inodes);
}
