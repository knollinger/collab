package org.knollinger.workingtogether.hashtags.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.hashtags.dtos.SaveHashtagsReqDTO;
import org.knollinger.workingtogether.hashtags.exceptions.TechnicalHashTagException;
import org.knollinger.workingtogether.hashtags.mapper.IHashTagMapper;
import org.knollinger.workingtogether.hashtags.services.IHashTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "v1/hashtags")
public class HashTagController
{
    @Autowired
    IHashTagService hashTagSvc;

    @Autowired
    IHashTagMapper hashTagMapper;

    /**
     * @return
     */
    @GetMapping()
    public List<String> getAllHashTags()
    {

        try
        {
            return this.hashTagSvc.getAllHashTags();
        }
        catch (TechnicalHashTagException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @return
     */
    @GetMapping(path = "/{uuid}")
    public List<String> getHashTagsByResourceId(@PathVariable("uuid") UUID uuid)
    {

        try
        {
            return this.hashTagSvc.getHashTagsByResource(uuid);
        }
        catch (TechnicalHashTagException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param req
     */
    @PostMapping()
    public void saveHashTags(@RequestBody SaveHashtagsReqDTO req)
    {
        try
        {
            this.hashTagSvc.saveHashTags(this.hashTagMapper.fromDTO(req));
        }
        catch (TechnicalHashTagException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }

    }
}
