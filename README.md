# ChitChat

ChitChat is an instant messaging web application which allows users to create rooms
and invite other users into those rooms. Each room will allow the users in it to 
message each other instantly.

# Implementation Details and Features

This web application uses the Javascript library, React JS, to help develop the frontend
and user interface of the system. Meanwhile, Express JS, will be used to develop the backend
of the system. 

### Registration

The first feature of the system would be a registration page which allows the user
to register their account if provided with a valid email address, username, password, and date of birth. The
backend then receives this data, makes a query attempt to create a new account with the credentials 
provided. If the email address or username are already taken, an error will be sent back to the client
and show an error message. Otherwise, a hash of the password is created using the Argon2 library, and is stored
in the user accounts table in a MySQL database along with the user's email, username, and date of birth.
The server then sends a confirmation to the client which will then show that the registration was successful to the user.

### Login

##### Authentication

When the user logs in with the their credentials, a request is sent to 
the server. The server then verifies that the credentials are valid by first querying the user accounts table in the database for the 
email address provided. If the email address isn't inside the user accounts table, 
the server sends an error message back to the client, which will then let the user know that there is no account
registered for the email provided. If the email address is inside the user accounts table, the server then
retrieves it's corresponding password hash from the user accounts table and verifies it using the Argon2 library
with the password given by the user. If the password is invalid, an error message is sent from the server to the client,
where then the client shows an error to the user that the password is invalid. If the password is valid, 
The client is provided with both an access token and renewal token. The user may only be allowed to enter an 
invalid password for an existing email address five times, after which the user won't be permitted to make any login requests
for that email for the next thirty minutes. 


#### Access and Renew Tokens

Upon successful login, both an access and renew token are provided to the user. The access 
token will be stored in local storage while the renew token will be stored as an httponly cookie. The
access token will expire upon one hour upon creation. Refresh tokens will expire after 14 days. The access token
will be used to authorize the user to access their services. When the access token expires, the client makes a
request to the server for a new access token using their renew token. If their renew token is valid, a new
access token will be provided. When the user decides to logout, the access token is removed from local storage and
a message is sent from the client to the server which will then add the token to a database containing forbidden
renew tokens. These forbidden tokens will be stored in the database until they expire. 


### Room Creation

To create a room, the user will click on a button with a "+" symbol on the left sidebar. Upon clicking the button,
a window will appear asking the user for the room's name and maximum number of users. Once this information is received,
the chatroom server will then create a new room in the database. In the database, there will be a rooms table which includes 
room_id, name, max_users, room_channels_table_id, room_users_table_id, and ban_table_id,. The room_channels_table_id will contain the columns channel_id,
name, messages, and tags_required. The room_users_table_id column contains the corresponding table made for the users of the room which
will contain the columns userid, tags, isModerator, and isAdmin. The ban table for each room will contain the columns userid,
and expiration_time. Each user is permitted to only create 10 active rooms. Upon creation of a room,
a default general channel is created. The creator of the room is permitted to create more channels with their own unique tags.   

### Room Settings and Moderation 

Room admins, the user who first created the room, are permitted to change room and channel name, create channels, delete both the room and channels,
ban or block users from entering the room, kick users, add tag restrictions to channels, and add tags to users. Moderators may ban or kick users from
entering the room. 

### Future Features

##### Live Voice and Video Chat


### Technologies Used
- Javascript
- Node JS
- React JS
- Express JS
- Socket IO
- MySQL
- Apache Cassandra 


## Authors

* **Stephen Wong** - *Initial work* - [Stephen491](https://github.com/Stephen491)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
