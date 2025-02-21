package org.knollinger.workingtogether.search.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.search.models.INodeSearchResultItem;
import org.knollinger.workingtogether.search.models.SearchResult;
import org.knollinger.workingtogether.search.models.SearchResult.SearchResultBuilder;
import org.knollinger.workingtogether.search.services.ISearchService;
import org.knollinger.workingtogether.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements ISearchService
{
    private static final String SQL_SEARCH_FILES = "" //
        + "select name, uuid, parent from inodes" //
        + " where name like ?";

    @Autowired()
    private IDbService dbService;

    /**
     *
     */
    @Override
    public SearchResult search(List<String> searchItems)
    {
        SearchResultBuilder result = SearchResult.builder();
        
        Connection conn = null;
        try
        {
            conn = this.dbService.openConnection();
            result.inodes(this.searchFiles(searchItems, conn));
        }
        catch (SQLException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        finally
        {
            this.dbService.closeQuitely(conn);
        }

        return result.build();
    }

    private List<INodeSearchResultItem> searchFiles(List<String> searchItems, Connection conn) throws SQLException
    {
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<INodeSearchResultItem> result = new ArrayList<>();

            stmt = conn.prepareStatement(SQL_SEARCH_FILES);
            stmt.setString(1, String.format("%%%1$s%%", searchItems.get(0)));
            rs = stmt.executeQuery();
            while (rs.next())
            {
                INodeSearchResultItem item = INodeSearchResultItem.builder() //
                    .name(rs.getString("name")) //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .parent(UUID.fromString(rs.getString("parent"))) //
                    .build();
                result.add(item);
            }
            return result;
        }
        finally
        {
            this.dbService.closeQuitely(rs);
            this.dbService.closeQuitely(stmt);
        }
    }


}
