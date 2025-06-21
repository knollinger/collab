package org.knollinger.colab.search.mapper;

import java.util.List;

import org.knollinger.colab.search.dtos.INodeSearchResultItemDTO;
import org.knollinger.colab.search.dtos.SearchRequestDTO;
import org.knollinger.colab.search.dtos.SearchResultDTO;
import org.knollinger.colab.search.models.INodeSearchResultItem;
import org.knollinger.colab.search.models.SearchRequest;
import org.knollinger.colab.search.models.SearchResult;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface ISearchMapper
{
    public SearchRequest fromDTO(SearchRequestDTO dto);
    public SearchRequestDTO toDTO(SearchRequest req);

    public INodeSearchResultItem fromDTO(INodeSearchResultItemDTO dto);
    public INodeSearchResultItemDTO toDTO(INodeSearchResultItem item);

    public List<INodeSearchResultItem> fromDTO(List<INodeSearchResultItemDTO> dto);
    public List<INodeSearchResultItemDTO> toDTO(List<INodeSearchResultItem> item);
    
    public SearchResult fromDTO(SearchResultDTO dto);
    public SearchResultDTO toDTO(SearchResult result);
}
