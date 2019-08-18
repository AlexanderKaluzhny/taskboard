Task Board v2
=============

Multi-user list of tasks providing the Add, Edit, Delete, Mark as Done, searching, filtering.
Implemented in Python/Django, Django-REST-framework. Front-end of the main page of v2 is reimplemented in React.js & Material-UI.

`taskboardreact.herokuapp.com`_ (wait a little for a free dyno to wake up).

v1 where front-end was implemented in Vanilla JS and Bootstrap is here `tasklisting.herokuapp.com`_

:License: MIT
:Python: 3.7.2
:Django: 2.2.4

.. image:: https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg
     :target: https://github.com/pydanny/cookiecutter-django/
     :alt: Built with Cookiecutter Django

.. _`taskboardreact.herokuapp.com`: https://taskboardreact.herokuapp.com
.. _`tasklisting.herokuapp.com`: https://tasklisting.herokuapp.com

Functionality
-------------------------

* Add, Edit, Delete, Mark as 'Done', Searching, filtering
* Multi-user. Task ownership
* RESTful
* Easy demo login with demo users
* Deployed to Heroku free dyno `taskboardreact.herokuapp.com`_ (so wait a little for it to wake up).

.. _`taskboardreact.herokuapp.com`: https://taskboardreact.herokuapp.com


Basic Commands
--------------

Setting Up Your Users
^^^^^^^^^^^^^^^^^^^^^

* To create a **normal user account**, just go to Sign Up and fill out the form, or use a 'login as a demo user' link.

* Email verification is available, but disabled for demo process to be easy.

* To create an **superuser account**, use this command::

    $ python manage.py createsuperuser

For convenience, you can keep your normal user logged in on Chrome and your superuser logged in on Firefox (or similar), so that you can see how the site behaves for both kinds of users.

Setting Up Demo Users and their tasks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Demo users are created dynamically during login as a demo user.
* Or using the **deployment.demo** module functions.
* Demo tasks are created using the **deployment.demo** functions.

Deployment to Heroku
--------------------

See detailed `cookiecutter-django Heroku documentation`_.

.. _`cookiecutter-django Heroku documentation`: http://cookiecutter-django.readthedocs.io/en/latest/deployment-on-heroku.html



