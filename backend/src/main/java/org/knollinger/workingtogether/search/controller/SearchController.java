package org.knollinger.workingtogether.search.controller;

import org.knollinger.workingtogether.search.dtos.SearchRequestDTO;
import org.knollinger.workingtogether.search.dtos.SearchResultDTO;
import org.knollinger.workingtogether.search.mapper.ISearchMapper;
import org.knollinger.workingtogether.search.models.SearchResult;
import org.knollinger.workingtogether.search.services.ISearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/v1/search")
public class SearchController
{
    @Autowired()
    private ISearchService searchSvc;
    
    @Autowired()
    private ISearchMapper searchMapper;

    @PostMapping()
    public SearchResultDTO search(@RequestBody() SearchRequestDTO request)
    {
        SearchResult result = this.searchSvc.search(request.getSearch());
        return this.searchMapper.toDTO(result);
    }
}
