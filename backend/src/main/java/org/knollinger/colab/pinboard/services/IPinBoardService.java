package org.knollinger.colab.pinboard.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinboard.exceptions.TechnicalPinBoardException;
import org.knollinger.colab.pinboard.models.PinBoard;
import org.knollinger.colab.pinboard.models.PinCard;

public interface IPinBoardService
{
    public List<PinBoard> getAllPinBoards() throws TechnicalPinBoardException;

    public List<PinCard> getCards(UUID boardId) throws TechnicalPinBoardException;
}
