package org.knollinger.colab.pinboard.mapper;

import java.util.List;

import org.knollinger.colab.pinboard.dtos.PinBoardDTO;
import org.knollinger.colab.pinboard.dtos.PinCardDTO;
import org.knollinger.colab.pinboard.models.PinBoard;
import org.knollinger.colab.pinboard.models.PinCard;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface IPinBoardMapper
{
    public PinBoard boardFromDTO(PinBoardDTO dto);
    public PinBoardDTO boardToDTO(PinBoard board);
    
    public List<PinBoard> boardsFromDTO(List<PinBoardDTO> dto);
    public List<PinBoardDTO> boardsToDTO(List<PinBoard> board);
    
    public PinCard cardFromDTO(PinCardDTO dto);
    public PinCardDTO cardToDTO(PinCard card);
    
    public List<PinCard> cardsFromDTO(List<PinCardDTO> dto);
    public List<PinCardDTO> cardsToDTO(List<PinCard> cards);
}
