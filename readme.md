# Waffle order management app

The following are the pages available in the app:
1. Home page - /
2. Queue page - /queue
3. Login page - /login
4. Admin page - /admin
5. Flavour management page - /flavours

For home page, this is where people can see the waffle flavour for the day, and submit a form to be in the queue.

For queue page, this is where we show all the people who are queueing for the waffle and have not yet collected their waffle.

For login page, this is where the admin will login to the admin section of the app.

For admin page, this is where the admin will be able to:
1. Submit a form to add someone into the queue
2. See a list of people who submitted the form in chronological order
3. Click on 'Send slack' to trigger a slack @mention message to the person based on email address 
4. Click on the check box to indicate the person had collected the waffle
5. Click on edit to edit the submitted email address

For flavour management page, this is where the admin can submit the form with the waffle flavour of the day. This will be reflected on the home page accordingly. There is also a table with the list of previous waffle flavours. 