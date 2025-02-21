package org.knollinger.workingtogether.user.controller;

import java.util.List;
import java.util.UUID;

import org.knollinger.workingtogether.user.dtos.UserDTO;
import org.knollinger.workingtogether.user.exceptions.DuplicateUserException;
import org.knollinger.workingtogether.user.exceptions.TechnicalUserException;
import org.knollinger.workingtogether.user.exceptions.UserNotFoundException;
import org.knollinger.workingtogether.user.mapper.IUserMapper;
import org.knollinger.workingtogether.user.models.Avatar;
import org.knollinger.workingtogether.user.models.User;
import org.knollinger.workingtogether.user.services.IAvatarService;
import org.knollinger.workingtogether.user.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * 
 */
@RestController
@RequestMapping(path = "/v1/user")
public class UserController
{
    @Autowired
    private IUserService userSvc;

    @Autowired
    private IAvatarService avatarSvc;

    @Autowired
    private IUserMapper userMapper;

    /**
     * @param uuid
     * @return
     */
    @GetMapping(path = "/list")
    public List<UserDTO> listUsers()
    {
        try
        {
            List<User> user = this.userSvc.listUser();
            return this.userMapper.toDTO(user);
        }
        catch (TechnicalUserException e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
    }

    /**
     * @param uuid
     * @return
     */
    @GetMapping(path = "/get/{uuid}")
    public UserDTO getUser(@PathVariable("uuid") UUID uuid)
    {
        try
        {
            User user = this.userSvc.getUser(uuid);
            return this.userMapper.toDTO(user);
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
     * @param userDTO
     * @return
     */
    @PostMapping(path = "/save")
    public UserDTO saveUser(//
        @RequestParam("uuid") UUID uuid, //
        @RequestParam("accountName") String accountName, //
        @RequestParam("email") String email, //
        @RequestParam("surname") String surname, //
        @RequestParam("lastname") String lastname, //
        @RequestParam(name = "avatar", required = false) MultipartFile avatar)
    {
        try
        {
            User user = User.builder() //
                .userId(uuid) //
                .accountName(accountName) //
                .email(email) //
                .surname(surname) //
                .lastname(lastname).build();

            user = (uuid.equals(User.EMPTY_USER_ID)) ? this.userSvc.createUser(user) : this.userSvc.saveUser(user);
            if (avatar != null)
            {
                this.avatarSvc.saveAvatar(user.getUserId(), avatar);
            }
            return this.userMapper.toDTO(user);
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
}
