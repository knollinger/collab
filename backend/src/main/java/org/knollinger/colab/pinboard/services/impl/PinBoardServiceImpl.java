package org.knollinger.colab.pinboard.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinboard.exceptions.TechnicalPinBoardException;
import org.knollinger.colab.pinboard.models.PinBoard;
import org.knollinger.colab.pinboard.models.PinCard;
import org.knollinger.colab.pinboard.services.IPinBoardService;
import org.knollinger.colab.utils.services.IDbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PinBoardServiceImpl implements IPinBoardService
{
    private static final String SQL_GET_PINBOARDS = "" //
        + "select uuid, name, owner from pinboards" //
        + "    order by name;";

    private static final String SQL_GET_CARDS = "" //
        + "select uuid, title, owner, created from pinboardCards" //
        + "  where boardId=?" //
        + "  order by created";
    
    @Autowired
    private IDbService dbSvc;

    /**
     *
     */
    @Override
    public List<PinBoard> getAllPinBoards() throws TechnicalPinBoardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<PinBoard> result = new ArrayList<PinBoard>();

            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_PINBOARDS);
            rs = stmt.executeQuery();
            while (rs.next())
            {
                PinBoard board = PinBoard.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .name(rs.getString("name")) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .build();
                result.add(board);
            }
            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalPinBoardException("Die Liste der Pin-Wände konnte nicht gelesen werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }

    /**
     *
     */
    @Override
    public List<PinCard> getCards(UUID boardId) throws TechnicalPinBoardException
    {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try
        {
            List<PinCard> result = new ArrayList<PinCard>();
            conn = this.dbSvc.openConnection();
            stmt = conn.prepareStatement(SQL_GET_CARDS);
            stmt.setString(1, boardId.toString());
            rs = stmt.executeQuery();
            while (rs.next())
            {
                PinCard card = PinCard.builder() //
                    .uuid(UUID.fromString(rs.getString("uuid"))) //
                    .boardId(boardId) //
                    .title(rs.getString("title")) //
                    .owner(UUID.fromString(rs.getString("owner"))) //
                    .created(rs.getTimestamp("created")) //
                    .build();
                result.add(card);
            }

            return result;
        }
        catch (SQLException e)
        {
            throw new TechnicalPinBoardException("Die Liste der Pin-Cards konnte nicht gelesen werden.", e);
        }
        finally
        {
            this.dbSvc.closeQuitely(rs);
            this.dbSvc.closeQuitely(stmt);
            this.dbSvc.closeQuitely(conn);
        }
    }
}
