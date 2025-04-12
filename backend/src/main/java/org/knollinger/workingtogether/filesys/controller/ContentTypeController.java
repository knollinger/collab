package org.knollinger.workingtogether.filesys.controller;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.knollinger.workingtogether.filesys.services.IContentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Alle Dienste rund um Content-Types
 */
@RestController
@RequestMapping(path = "/v1/contenttype")
public class ContentTypeController
{
    @Autowired
    private IContentTypeService contentTypeSvc;

    /**
     * Liefert eine Redirektion auf die URI für das Image des ContentTypes
     * 
     * @param mainType der HauptTyp, zum Beispiel "image"
     * @param subType der UnterType, zum Beispiel "svg+xml"
     * 
     * @return die URI auf das Image
     */
    @GetMapping("/{mainType}/{subType}")
    public RedirectView getContentTypeIcon( //
        @PathVariable("mainType") String mainType, //
        @PathVariable("subType") String subType)
    {
        String main = URLDecoder.decode(mainType, StandardCharsets.UTF_8);
        String sub = URLDecoder.decode(subType, StandardCharsets.UTF_8);
        return new RedirectView(this.contentTypeSvc.getTypeIcon(main, sub));
    }
}
