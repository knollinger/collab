package org.knollinger.colab.search.services;

import java.util.List;

import org.knollinger.colab.search.models.SearchResult;

public interface ISearchService
{
    public SearchResult search(List<String> searchItems);
}
