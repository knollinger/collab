package org.knollinger.workingtogether.search.services;

import java.util.List;

import org.knollinger.workingtogether.search.models.SearchResult;

public interface ISearchService
{
    public SearchResult search(List<String> searchItems);
}
