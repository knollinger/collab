package org.knollinger.colab.filesys.controller;

import java.util.List;

import org.knollinger.colab.filesys.dtos.CheckDuplicateEntriesRequestDTO;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.services.ICheckDuplicateInodesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 
 */
@RestController
@RequestMapping(path = "/v1/duplicates")
public class DuplicateEntriesController
{
    @Autowired
    ICheckDuplicateInodesService svc;

    /**
     * @param req
     * @return
     */
    @PostMapping()
    List<String> checkDuplicateEntries(@RequestBody CheckDuplicateEntriesRequestDTO req)
    {
        try
        {
            return this.svc.checkDuplicates(req.getTargetFolderId(), req.getNames());
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
