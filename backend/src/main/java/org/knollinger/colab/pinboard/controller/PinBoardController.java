package org.knollinger.colab.pinboard.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.pinboard.dtos.PinBoardDTO;
import org.knollinger.colab.pinboard.dtos.PinCardDTO;
import org.knollinger.colab.pinboard.exceptions.TechnicalPinBoardException;
import org.knollinger.colab.pinboard.mapper.IPinBoardMapper;
import org.knollinger.colab.pinboard.models.PinBoard;
import org.knollinger.colab.pinboard.models.PinCard;
import org.knollinger.colab.pinboard.services.IPinBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/v1/pinboards")
public class PinBoardController
{
    @Autowired
    private IPinBoardService pinBoardSvc;

    @Autowired
    private IPinBoardMapper pinBoardMapper;

    @GetMapping(path = "")
    public List<PinBoardDTO> getAllPinBoards()
    {
        try
        {
            List<PinBoard> result = this.pinBoardSvc.getAllPinBoards();
            return this.pinBoardMapper.boardsToDTO(result);
        }
        catch (TechnicalPinBoardException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    @GetMapping(path = "/{board}")
    public List<PinCardDTO> getCards(@PathVariable(name = "board") UUID boardId)
    {
        try
        {
            List<PinCard> cards = this.pinBoardSvc.getCards(boardId);
            return this.pinBoardMapper.cardsToDTO(cards);
        }
        catch (TechnicalPinBoardException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
