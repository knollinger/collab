package org.knollinger.workingtogether.user.services;

import java.util.List;

import org.knollinger.workingtogether.user.exceptions.TechnicalGroupException;
import org.knollinger.workingtogether.user.models.Group;

public interface IGroupService
{
    public List<Group> getAllGroups() throws TechnicalGroupException;
}
