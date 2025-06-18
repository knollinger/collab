package org.knollinger.colab.filesys.services.impl;

import org.knollinger.colab.filesys.services.IContentTypeService;
import org.springframework.stereotype.Service;

/**
 * Liefert die URI zu den svg-Images der Mimetypes
 */
@Service
public class ContentTypeServiceImpl implements IContentTypeService
{
    /**
     * liefert die SubURI zu einem gegebenen MimeType.
     * 
     * Für viele MimeTypes liegt ein generisches Image für den 
     * SubType vor. image/png hat zum Beispiel kein explizites
     * Image, dafür eiber ein generisches mit dem Pseudo-SubType
     * "x-generic".
     * 
     * Sollte also kein exakt passendes Image gefunden werden, 
     * so wird versucht über den SubType "x-generic" eins zu 
     * ermitteln.
     * 
     * Schlägt auch das fehl, so wird die uri für das 
     * "unbekannter Typ"-Image geliefert.
     * 
     * @param mainType
     * @param subType
     * @return liemanls <code>null</code>
     */
    @Override
    public String getTypeIcon(String mainType, String subType)
    {
        String result = this.findResource(mainType, subType);
        if (result == null)
        {
            result = this.findResource(mainType, "x-generic");
            if (result == null)
            {
                result = "/mimetypes/unknown.svg";
            }
        }
        return result;
    }

    /**
     * @param mainType
     * @param subType
     * @return
     */
    private String findResource(String mainType, String subType)
    {
        String uri = null;
        String resource = String.format("/mimetypes/%1$s-%2$s.svg", mainType, subType);
        String path = "static" + resource;
        if (this.getClass().getClassLoader().getResource(path) != null)
        {
            uri = resource;
        }
        return uri;
    }
}
