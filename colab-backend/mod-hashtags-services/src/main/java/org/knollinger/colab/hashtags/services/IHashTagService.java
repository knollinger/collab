package org.knollinger.colab.hashtags.services;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.hashtags.exceptions.TechnicalHashTagException;
import org.knollinger.colab.hashtags.models.SaveHashtagsReq;

public interface IHashTagService
{
    public List<String> getAllHashTags() throws TechnicalHashTagException;

    List<String> getHashTagsByResource(UUID uuid) throws TechnicalHashTagException;

    public void saveHashTags(SaveHashtagsReq fromDTO) throws TechnicalHashTagException;
}
