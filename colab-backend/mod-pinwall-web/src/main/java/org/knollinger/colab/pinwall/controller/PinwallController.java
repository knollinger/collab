package org.knollinger.colab.pinwall.controller;

import java.util.List;

import org.knollinger.colab.pinwall.dtos.PostItDTO;
import org.knollinger.colab.pinwall.exc.TechnicalPillwallException;
import org.knollinger.colab.pinwall.mapper.IPinwallMapper;
import org.knollinger.colab.pinwall.services.IPinwallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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
    @GetMapping(path="/all")
    public List<PostItDTO> getAll()
    {
        try
        {
            return this.mapper.toDTO(this.pinwallSvc.getAll());
        }
        catch (TechnicalPillwallException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
