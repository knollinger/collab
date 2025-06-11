package org.knollinger.workingtogether.filesys.controller;

import java.util.List;

import org.knollinger.workingtogether.filesys.dtos.CheckDuplicateEntriesRequestDTO;
import org.knollinger.workingtogether.filesys.dtos.INodeDTO;
import org.knollinger.workingtogether.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.workingtogether.filesys.mapper.IFileSysMapper;
import org.knollinger.workingtogether.filesys.services.ICheckDuplicateInodesService;
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

    @Autowired
    IFileSysMapper mapper;

    /**
     * @param req
     * @return
     */
    @PostMapping()
    List<INodeDTO> checkDuplicateEntries(@RequestBody CheckDuplicateEntriesRequestDTO req)
    {
        try
        {
            return this.mapper.toDTO(this.svc.checkDuplicates(req.getTargetFolderId(), req.getInodes()));
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
