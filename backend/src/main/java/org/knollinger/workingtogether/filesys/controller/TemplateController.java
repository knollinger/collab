package org.knollinger.workingtogether.filesys.controller;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 */
@RestController
@RequestMapping(path = "v1/templates")
public class TemplateController
{
    /**
     * @return
     */
    @GetMapping()
    public ResponseEntity<InputStreamResource> getAllGroups()
    {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("templates/structure.json");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new ResponseEntity<>(new InputStreamResource(in), headers, HttpStatus.OK);
    }
    
    /**
     * @param parent
     * @param contentType
     * @return
     */
    @PostMapping()
    public UUID createDocument(UUID parent, String contentType, String name)
    {
        return null;
    }
}
