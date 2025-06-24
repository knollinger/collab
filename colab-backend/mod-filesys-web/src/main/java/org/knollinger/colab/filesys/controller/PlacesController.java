package org.knollinger.colab.filesys.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.mapper.IFileSysMapper;
import org.knollinger.colab.filesys.services.IPlacesService;
import org.knollinger.colab.user.services.ICurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/v1/places")
public class PlacesController
{
    @Autowired
    IPlacesService placesSvc;

    @Autowired
    IFileSysMapper fileSysMapper;

    @Autowired
    private ICurrentUserService currUserSvc;

    /**
     * @param userId
     * @return
     */
    @GetMapping()
    List<INodeDTO> getPlaces()
    {
        try
        {
            UUID userId = this.currUserSvc.get().getUser().getUserId();
            return this.fileSysMapper.toDTO(this.placesSvc.getPlaces(userId));
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param uuids
     */
    @PutMapping()
    void addPlaces(@RequestBody List<INodeDTO> nodes)
    {
        try
        {
            UUID userId = this.currUserSvc.get().getUser().getUserId();
            this.placesSvc.addPlaces(userId, this.fileSysMapper.fromDTO(nodes));
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (DuplicateEntryException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
    }

    /**
     * @param uuid
     */
    @DeleteMapping("/{uuid}")
    void deletePlace(@PathVariable("uuid") UUID uuid)
    {
        try
        {
            UUID userId = this.currUserSvc.get().getUser().getUserId();
            this.placesSvc.deletePlace(userId, uuid);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
