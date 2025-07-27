package org.knollinger.colab.hashtags.services;

import java.sql.Connection;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.hashtags.exceptions.TechnicalHashTagException;
import org.knollinger.colab.hashtags.models.EHashTagType;

public interface IHashTagService
{
    public List<String> getAllHashTags() throws TechnicalHashTagException;

    public List<String> getHashTagsByResource(UUID uuid) throws TechnicalHashTagException;
    public List<String> getHashTagsByResource(UUID uuid, Connection conn) throws TechnicalHashTagException;
    public void saveHashTags(UUID refId, List<String> tags, EHashTagType type) throws TechnicalHashTagException;
    public void saveHashTags(UUID refId, List<String> tags, EHashTagType type, Connection conn) throws TechnicalHashTagException;
    public void removeHashTagsByRefId(UUID refId, Connection conn) throws TechnicalHashTagException;
}
