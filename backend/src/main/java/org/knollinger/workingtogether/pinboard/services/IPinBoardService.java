package org.knollinger.workingtogether.pinboard.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.pinboard.exceptions.TechnicalPinBoardException;
import org.knollinger.workingtogether.pinboard.models.PinBoard;
import org.knollinger.workingtogether.pinboard.models.PinCard;

public interface IPinBoardService
{
    public List<PinBoard> getAllPinBoards() throws TechnicalPinBoardException;

    public List<PinCard> getCards(UUID boardId) throws TechnicalPinBoardException;
}
