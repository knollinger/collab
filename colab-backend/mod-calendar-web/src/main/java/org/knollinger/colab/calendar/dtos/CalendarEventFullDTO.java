package org.knollinger.colab.calendar.dtos;

import java.util.List;

import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.user.dtos.UserDTO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 */
@Builder()
@NoArgsConstructor()
@AllArgsConstructor()
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.NONE)
public class CalendarEventFullDTO
{
    private CalendarEventCoreDTO core;
    private List<UserDTO> reqPersons;
    private List<UserDTO> optPersons;
    private List<String> hashTags;
    private List<INodeDTO> attachments;
}


