package org.knollinger.workingtogether.user.controller;

import java.util.List;

import org.knollinger.workingtogether.user.dtos.GroupDTO;
import org.knollinger.workingtogether.user.exceptions.TechnicalGroupException;
import org.knollinger.workingtogether.user.mapper.IGroupMapper;
import org.knollinger.workingtogether.user.models.Group;
import org.knollinger.workingtogether.user.services.IListGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/v1/groups")
public class GroupController
{
    @Autowired
    private IListGroupService groupSvc;

    @Autowired
    private IGroupMapper groupMapper;

    @GetMapping(path = "/list")
    public List<GroupDTO> getAllGroups(//
        @RequestParam(name = "skipPrimary", defaultValue = "true") boolean skipPrimary, //
        @RequestParam(name = "deepScan", defaultValue = "true") boolean deepScan)
    {
        try
        {
            List<Group> groups = this.groupSvc.getAllGroups(skipPrimary, deepScan);
            return this.groupMapper.toDTO(groups);
        }
        catch (TechnicalGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
