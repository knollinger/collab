package org.knollinger.colab.filesys.services;

/**
 * 
 */
public interface IContentTypeService
{
    /**
     * liefere die relative URI zum Image eines gegebenen Content-Types
     * 
     * @param mainType
     * @param subType 
     * @return
     */
    public String getTypeIcon(String mainType, String subType);
}
