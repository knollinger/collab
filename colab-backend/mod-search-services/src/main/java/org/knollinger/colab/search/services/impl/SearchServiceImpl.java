package org.knollinger.colab.search.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.search.models.GroupSearchResultItem;
import org.knollinger.colab.search.models.INodeSearchResultItem;
import org.knollinger.colab.search.models.SearchResult;
import org.knollinger.colab.search.models.UserSearchResultItem;
import org.knollinger.colab.search.services.ISearchService;
import org.knollinger.colab.utils.services.IDbService;
import org.knollinger.colab.search.models.SearchResult.SearchResultBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 */
@Service
public class SearchServiceImpl implements ISearchService
{
    private static final String SQL_SEARCH_FILES = "" //
        + "select name, uuid, parent from inodes" //
        + " where name like ?";

    private static final String SQL_SEARCH_USERS = "" //
        + "select accountName, surname, lastname, email, uuid from users" //
        + " where surname like ? or lastname like? or accountName like ? or email like ?";

    private static final String SQL_SEARCH_GROUPS = "" //
        + "select name, uuid from groups" //
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
            result.users(this.searchUsers(searchItems, conn));
            result.groups(this.searchGroups(searchItems, conn));
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

    /**
     * @param searchItems
     * @param conn
     * @return
     * @throws SQLException
     */
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

    /**
     * @param searchItems
     * @param conn
     * @return
     * @throws SQLException
     */
    private List<UserSearchResultItem> searchUsers(List<String> searchItems, Connection conn) throws SQLException {
        
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<UserSearchResultItem> result = new ArrayList<>();

            String search = String.format("%%%1$s%%", searchItems.get(0));
            stmt = conn.prepareStatement(SQL_SEARCH_USERS);
            stmt.setString(1, search);
            stmt.setString(2, search);
            stmt.setString(3, search);
            stmt.setString(4, search);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                UserSearchResultItem item = UserSearchResultItem.builder() //
                    .accountName(rs.getString("accountName")) //
                    .lastName(rs.getString("lastname")) //
                    .surName(rs.getString("surname")) //
                    .email(rs.getString("email")) //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
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

    /**
     * @param searchItems
     * @param conn
     * @return
     * @throws SQLException
     */
    private List<GroupSearchResultItem> searchGroups(List<String> searchItems, Connection conn) throws SQLException {
        
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<GroupSearchResultItem> result = new ArrayList<>();

            stmt = conn.prepareStatement(SQL_SEARCH_GROUPS);
            stmt.setString(1, String.format("%%%1$s%%", searchItems.get(0)));
            rs = stmt.executeQuery();
            while (rs.next())
            {
                GroupSearchResultItem item = GroupSearchResultItem.builder() //
                    .name(rs.getString("name")) //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
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
