package org.knollinger.colab.filesys.exceptions;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.models.INode;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

/**
 * 
 */
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class DuplicateEntryException extends Exception
{
    private static final long serialVersionUID = 1L;
    private UUID parentId;
    private List<INode> childs;

    /**
     * 
     * @param parentId
     * @param childs
     * @param t
     */
    public DuplicateEntryException(List<INode> childs, Throwable t)
    {
        super("Es existieren bereits bereits gleichnamige Objekte in diesem Ordner", t);
        
        this.childs = childs;
    }

    /**
     * 
     * @param childs
     */
    public DuplicateEntryException(List<INode> childs)
    {
        this(childs, null);
    }

    /**
     * 
     * @param child
     */
    public DuplicateEntryException(INode child, Throwable t)
    {
        this(Arrays.asList(child), t);
    }

    /**
     * 
     * @param child
     */
    public DuplicateEntryException(INode child)
    {
        this(Arrays.asList(child));
    }
}
