package org.knollinger.colab.search.controller;

import org.knollinger.colab.search.dtos.SearchRequestDTO;
import org.knollinger.colab.search.dtos.SearchResultDTO;
import org.knollinger.colab.search.mapper.ISearchMapper;
import org.knollinger.colab.search.models.SearchResult;
import org.knollinger.colab.search.services.ISearchService;
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
