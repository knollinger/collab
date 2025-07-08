package org.knollinger.colab.user.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.colab.user.dtos.UserDTO;
import org.knollinger.colab.user.exceptions.DuplicateUserException;
import org.knollinger.colab.user.exceptions.TechnicalUserException;
import org.knollinger.colab.user.exceptions.UserNotFoundException;
import org.knollinger.colab.user.mapper.IUserMapper;
import org.knollinger.colab.user.models.Avatar;
import org.knollinger.colab.user.models.User;
import org.knollinger.colab.user.services.IAvatarService;
import org.knollinger.colab.user.services.ICreateUserService;
import org.knollinger.colab.user.services.IDeleteUserService;
import org.knollinger.colab.user.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

/**
 * Der USerController stellt die REST-APIs für die elementaren CRUD-Ops bzgl der Benutzer bereit.
 * 
 * Zusätzlich stehen noch die APIs zur Verwaltung der Avatare und zur Volltext-Suche über alle
 * Benutzer bereit.
 */
@RestController
@RequestMapping(path = "v1/users")
public class UserController
{
    @Autowired
    private IUserService userSvc;

    @Autowired
    private ICreateUserService createUserSvc;

    @Autowired
    private IDeleteUserService deleteUserSvc;

    @Autowired
    private IAvatarService avatarSvc;

    @Autowired
    private IUserMapper userMapper;

    /**
     * Liefere die Liste aller Benutzer
     * 
     * @return
     */
    @GetMapping(path = "/all")
    public List<UserDTO> getAllUsers()
    {
        try
        {
            List<User> result = this.userSvc.listUser();
            return this.userMapper.toDTO(result);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * Lege einen neuen Benutzer an
     * 
     * @param user
     * @return
     */
    @PutMapping(path = "/user")
    public UserDTO createUser(@RequestBody UserDTO user)
    {
        try
        {
            User result = this.createUserSvc.createUser(this.userMapper.fromDTO(user));
            return this.userMapper.toDTO(result);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (DuplicateUserException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
    }

    /**
     * Lese einen Benutzer
     * 
     * @param uuid
     * @return
     */
    @GetMapping(path = "/user/{userId}")
    public UserDTO readUser(@PathVariable("userId") UUID uuid)
    {
        try
        {
            User result = this.userSvc.getUser(uuid);
            return this.userMapper.toDTO(result);
        }
        catch (UserNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * Aktualisiere einen Benutzer
     * 
     * @param user
     * @return
     */
    @PostMapping(path = "/user")
    public UserDTO updateUser(@RequestBody UserDTO user)
    {
        try
        {
            User result = this.userSvc.saveUser(this.userMapper.fromDTO(user));
            return this.userMapper.toDTO(result);
        }
        catch (UserNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
        catch (DuplicateUserException e)
        {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * Lösche einen Benutzer
     * 
     * @param uuid
     */
    @DeleteMapping(path = "/user/{userId}")
    public void deleteUser(@PathVariable("userId") UUID uuid)
    {
        try
        {
            this.deleteUserSvc.deleteUser(uuid);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
        catch (UserNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    /**
     * Liefere den Avatar eines Benutzers
     * 
     * @param uuid
     * @return
     */
    @GetMapping("/avatar/{uuid}")
    public ResponseEntity<InputStreamResource> getAvatar(@PathVariable("uuid") UUID uuid)
    {
        try
        {
            Avatar avatar = this.avatarSvc.getAvatar(uuid);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, avatar.contentType());
            return new ResponseEntity<>(new InputStreamResource(avatar.data()), headers, HttpStatus.OK);
        }
        catch (UserNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * Aktualisiere den Avatar eines Benutzers
     * 
     * @param uuid
     * @param avatar
     */
    @PostMapping(path = "/avatar", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateAvatar(@RequestParam("userId") UUID uuid, @RequestParam("avatar") MultipartFile avatar)
    {
        try
        {
            this.avatarSvc.saveAvatar(uuid, avatar);
        }
        catch (UserNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * Lösche den Avatar eines Benutzers
     * 
     * @param uuid
     */
    @DeleteMapping(path = "/avatar/{uuid}")
    public void deleteAvatar(@PathVariable("uuid") UUID uuid)
    {
        try
        {
            this.avatarSvc.deleteAvatar(uuid);
        }
        catch (UserNotFoundException e)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * Führe eine Volltext-Suche über alle Benutzer durch
     * @param search
     * @return
     */
    @GetMapping(path = "/search")
    public List<UserDTO> searchUsers(@RequestParam("search") String search)
    {

        try
        {
            List<User> result = this.userSvc.fullTextSearch(search);
            return this.userMapper.toDTO(result);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }
}
