package org.knollinger.colab.pinwall.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinwall.dtos.PostItDTO;
import org.knollinger.colab.pinwall.exc.NotFoundException;
import org.knollinger.colab.pinwall.exc.TechnicalPinwallException;
import org.knollinger.colab.pinwall.mapper.IPinwallMapper;
import org.knollinger.colab.pinwall.models.PostIt;
import org.knollinger.colab.pinwall.services.IPinwallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/v1/pinwall")
public class PinwallController
{
    @Autowired()
    private IPinwallService pinwallSvc;

    @Autowired()
    private IPinwallMapper mapper;

    /**
     * @return
     */
    @GetMapping(path = "/all")
    public List<PostItDTO> getAll()
    {
        try
        {
            return this.mapper.toDTO(this.pinwallSvc.getAll());
        }
        catch (TechnicalPinwallException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    @GetMapping(path = "/get/{uuid}")
    public PostItDTO get(@PathVariable("uuid") UUID uuid)
    {
        try
        {
            return this.mapper.toDTO(this.pinwallSvc.get(uuid));
        }
        catch (TechnicalPinwallException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PutMapping(path = "/create")
    public PostItDTO create(@RequestBody() PostItDTO postItDTO)
    {
        try
        {
            PostIt postIt = this.pinwallSvc.create(this.mapper.fromDTO(postItDTO));
            return this.mapper.toDTO(postIt);
        }
        catch (TechnicalPinwallException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    @PostMapping(path = "/save")
    public PostItDTO save(@RequestBody() PostItDTO postItDTO)
    {
        try
        {
            this.pinwallSvc.update(this.mapper.fromDTO(postItDTO));
            return postItDTO;
        }
        catch (TechnicalPinwallException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @DeleteMapping(path = "/delete/{uuid}")
    public void delete(@PathVariable("uuid") UUID uuid)
    {
        try
        {
            this.pinwallSvc.delete(uuid);
        }
        catch (TechnicalPinwallException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}
