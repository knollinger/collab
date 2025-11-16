package org.knollinger.colab.permissions.controller;

import java.util.UUID;

import org.knollinger.colab.permissions.dtos.ACLDTO;
import org.knollinger.colab.permissions.exceptions.ACLNotFoundException;
import org.knollinger.colab.permissions.exceptions.TechnicalACLException;
import org.knollinger.colab.permissions.mapper.IPermissionsMapper;
import org.knollinger.colab.permissions.models.ACL;
import org.knollinger.colab.permissions.services.IPermissionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path="/v1/acl")
public class ACLController
{
    @Autowired
    private IPermissionsMapper mapper;
    
    @Autowired
    private IPermissionsService permSvc;
    
    @PostMapping("/update/{resourceId}")
    public ACLDTO update(@PathVariable("resourceId") UUID resourceId, @RequestBody ACLDTO aclDto) {
    
        try
        {
            ACL result = this.permSvc.updateACL(resourceId, this.mapper.fromDTO(aclDto));
            return this.mapper.toDTO(result);
        }
        catch (TechnicalACLException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (ACLNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}
