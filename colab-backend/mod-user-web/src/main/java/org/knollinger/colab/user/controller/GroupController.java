package org.knollinger.colab.user.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.user.dtos.CreateGroupRequestDTO;
import org.knollinger.colab.user.dtos.GroupDTO;
import org.knollinger.colab.user.dtos.SaveGroupMemberseRquestDTO;
import org.knollinger.colab.user.exceptions.DuplicateGroupException;
import org.knollinger.colab.user.exceptions.GroupNotFoundException;
import org.knollinger.colab.user.exceptions.TechnicalGroupException;
import org.knollinger.colab.user.mapper.IGroupMapper;
import org.knollinger.colab.user.models.Group;
import org.knollinger.colab.user.services.IDeleteGroupService;
import org.knollinger.colab.user.services.IGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/v1/groups")
public class GroupController
{
    @Autowired
    private IGroupService groupSvc;

    @Autowired
    private IDeleteGroupService deleteGroupSvc;

    @Autowired
    private IGroupMapper groupMapper;

    /**
     * @param deepScan
     * @return
     */
    @GetMapping(path = "/list")
    public List<GroupDTO> getAllGroups(//
        @RequestParam(name = "deepScan", defaultValue = "true") boolean deepScan)
    {
        try
        {
            List<Group> groups = this.groupSvc.getAllGroups(deepScan);
            return this.groupMapper.toDTO(groups);
        }
        catch (TechnicalGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param userId
     * @return
     */
    @GetMapping(path = "/byUser/{userId}")
    public List<GroupDTO> getGroupsForUser(@PathVariable("userId") UUID userId)
    {
        try
        {
            List<Group> groups = this.groupSvc.getGroupsByUser(userId);
            return this.groupMapper.toDTO(groups);
        }
        catch (TechnicalGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param req
     */
    @PostMapping("/members")
    public void saveGroupMembers(@RequestBody() SaveGroupMemberseRquestDTO req)
    {
        try
        {
            this.groupSvc.saveGroupMembers(this.groupMapper.fromDTO(req.getParent()),
                this.groupMapper.fromDTO(req.getMembers()));
        }
        catch (GroupNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param name
     * @return
     */
    @PutMapping("")
    public GroupDTO createGroup(@RequestBody CreateGroupRequestDTO req)
    {
        try
        {
            return this.groupMapper.toDTO(this.groupSvc.createGroup(req.getName(), req.isPrimary()));
        }
        catch (DuplicateGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
        catch (TechnicalGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param groupId
     */
    @DeleteMapping("/{groupId}")
    public void deleteGroup(@PathVariable("groupId") UUID groupId)
    {
        try
        {
            this.deleteGroupSvc.deleteGroup(groupId);
        }
        catch (TechnicalGroupException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (GroupNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}
