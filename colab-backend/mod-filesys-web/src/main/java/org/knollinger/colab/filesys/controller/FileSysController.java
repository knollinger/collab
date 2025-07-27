package org.knollinger.colab.filesys.controller;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.knollinger.colab.filesys.dtos.INodeDTO;
import org.knollinger.colab.filesys.dtos.MoveINodeRequestDTO;
import org.knollinger.colab.filesys.dtos.RenameINodeRequestDTO;
import org.knollinger.colab.filesys.dtos.UploadFilesResponseDTO;
import org.knollinger.colab.filesys.exceptions.AccessDeniedException;
import org.knollinger.colab.filesys.exceptions.DuplicateEntryException;
import org.knollinger.colab.filesys.exceptions.NotFoundException;
import org.knollinger.colab.filesys.exceptions.TechnicalFileSysException;
import org.knollinger.colab.filesys.exceptions.UploadException;
import org.knollinger.colab.filesys.mapper.IFileSysMapper;
import org.knollinger.colab.filesys.models.INode;
import org.knollinger.colab.filesys.models.IPermissions;
import org.knollinger.colab.filesys.services.ICopyINodeService;
import org.knollinger.colab.filesys.services.IDeleteService;
import org.knollinger.colab.filesys.services.IFileSysService;
import org.knollinger.colab.filesys.services.IUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(path = "/v1/filesys")
public class FileSysController
{
    @Autowired
    private IFileSysService fileSysService;

    @Autowired
    private IDeleteService deleteSvc;

    @Autowired
    private IUploadService uploadSvc;

    @Autowired
    private ICopyINodeService copySvc;

    @Autowired
    private IFileSysMapper fileSysMapper;

    /**
     * @param uuid
     * @return
     */
    @GetMapping(path = "/{uuid}")
    public INodeDTO getINode(//
        @PathVariable("uuid") UUID uuid)
    {
        try
        {
            INode inode = this.fileSysService.getINode(uuid, IPermissions.READ);
            if (inode == null)
            {
                String msg = String.format("Die INode mit der UUID '%1§s' existiert nicht", uuid);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
            }
            return this.fileSysMapper.toDTO(inode);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
    }

    /**
     * @param parentId
     * @param foldersOnly
     * @return
     */
    @GetMapping(path = "/childs/{uuid}")
    public List<INodeDTO> getAllChilds(//
        @PathVariable("uuid") UUID parentId, //
        @RequestParam(name = "foldersOnly", defaultValue = "false") boolean foldersOnly)
    {
        try
        {
            List<INode> childs = this.fileSysService.getAllChilds(parentId, IPermissions.READ, foldersOnly);
            childs.sort(new INodeComparator());
            return this.fileSysMapper.toDTO(childs);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param uuid
     * @return
     */
    @GetMapping(path = "/path/{uuid}")
    public List<INodeDTO> getPath(//
        @PathVariable("uuid") UUID uuid)
    {
        try
        {
            List<INode> path = this.fileSysService.getPath(uuid);
            return this.fileSysMapper.toDTO(path);
        }
        catch (NotFoundException e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }

    }

    /**
     * @param req
     */
    @PostMapping(path = "/rename")
    public void rename(//
        @RequestBody() RenameINodeRequestDTO req)
    {
        try
        {
            this.fileSysService.rename(req.getUuid(), req.getName());
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (DuplicateEntryException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
    }

    /**
     * @param uuid
     */
    @DeleteMapping(path = "/delete")
    public void delete(//
        @RequestBody() List<UUID> uuids)
    {
        try
        {
            this.deleteSvc.deleteINodes(uuids);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param srcId
     * @param targetId
     */
    @PostMapping(path = "/move")
    public void move(@RequestBody() MoveINodeRequestDTO req)
    {
        try
        {
            List<INode> source = this.fileSysMapper.fromDTO(req.getSource());
            INode target = this.fileSysMapper.fromDTO(req.getTarget());
            this.fileSysService.move(source, target);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (DuplicateEntryException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    /**
     * Kopiere eine Sequenz von INodes in einen angegebenen Ziel-Ordner
     */
    @PostMapping(path = "/copy")
    public void copy(@RequestBody() MoveINodeRequestDTO req)
    {
        try
        {
            List<INode> source = this.fileSysMapper.fromDTO(req.getSource());
            INode target = this.fileSysMapper.fromDTO(req.getTarget());
            this.copySvc.copyINodes(source, target);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (DuplicateEntryException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    /**
     * @param parentId
     * @param name
     * @return
     */
    @PutMapping(path = "/createFolder/{parentId}/{name}")
    public INodeDTO createFolder(//
        @PathVariable("parentId") UUID parentId, //
        @PathVariable("name") String name)
    {
        try
        {
            INode inode = this.fileSysService.createFolder(parentId, URLDecoder.decode(name, StandardCharsets.UTF_8));
            return this.fileSysMapper.toDTO(inode);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (DuplicateEntryException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param parentId
     * @param name
     * @return
     */
    @PutMapping(path = "/createDocument/{parentId}/{name}/{contentType}")
    public INodeDTO createDocument(//
        @PathVariable("parentId") UUID parentId, //
        @PathVariable("name") String name, //
        @PathVariable("contentType") String contentType)
    {
        try
        {
            INode inode = this.fileSysService.createDocument(//
                parentId, //
                URLDecoder.decode(name, StandardCharsets.UTF_8),
                URLDecoder.decode(contentType, StandardCharsets.UTF_8));
            return this.fileSysMapper.toDTO(inode);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (DuplicateEntryException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param parentId
     * @param name
     * @return
     */
    @PostMapping(path = "/update")
    public INodeDTO updateINode(//
        @RequestBody() INodeDTO inode)
    {
        try
        {
            INode result = this.fileSysService.updateINode(this.fileSysMapper.fromDTO(inode));
            return this.fileSysMapper.toDTO(result);
        }
        catch (NotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (AccessDeniedException e)
        {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
        catch (TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param parentId
     * @param files
     */
    @PutMapping(path = "/upload")
    public UploadFilesResponseDTO uploadFiles(//
        @RequestParam("parent") UUID parentId, //
        @RequestParam("file") List<MultipartFile> files)
    {
        UploadFilesResponseDTO.UploadFilesResponseDTOBuilder result = UploadFilesResponseDTO.builder();

        try
        {
            List<INode> newNodes = this.uploadSvc.uploadFiles(parentId, files);
            result.newINodes(this.fileSysMapper.toDTO(newNodes));
        }
        catch (DuplicateEntryException e)
        {
            result.duplicateFiles(this.fileSysMapper.toDTO(e.getChilds()));
        }
        catch (UploadException | TechnicalFileSysException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch(Exception e) {
            e.printStackTrace();
            throw e;
        }
        return result.build();
    }

    /**
     * 
     */
    private static class INodeComparator implements Comparator<INode>
    {
        @Override
        public int compare(INode inode1, INode inode2)
        {
            if (inode1.isDirectory() && inode2.isDirectory())
            {
                return inode1.getName().compareToIgnoreCase(inode2.getName());
            }
            else
            {
                if (inode1.isDirectory())
                {
                    return -1;
                }
                else
                {
                    if (inode2.isDirectory())
                    {
                        return 1;
                    }
                    else
                    {
                        return inode1.getName().compareToIgnoreCase(inode2.getName());
                    }
                }
            }
        }
    }
}
