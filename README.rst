Task Board
==========

Multi-user list of tasks including the Add, Edit, Delete, Mark as Done functions,
searching, filtering. UI is built on top of REST-API.
Python/Django, Django-REST-framework, JavaScript/jQuery/Underscore.js

.. image:: https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg
     :target: https://github.com/pydanny/cookiecutter-django/
     :alt: Built with Cookiecutter Django


:License: MIT


Implemented functionality
-------------------------

* API based Add, Edit, Delete, Mark as 'Done' functionality.
* Multi-user. Task ownership.
* API based UI.
* All the forms are displayed in the modal dialog and rendered through the Underscore.js templates.
* Deployed to Heroku free dyno `tasklisting.herokuapp.com`_ (so wait a little of it to wake up).

.. _`tasklisting.herokuapp.com`: https://tasklisting.herokuapp.com

Possible enhancements
---------------------

* Defer loading of task description, so it would be loaded at the moment the task information form is opened.
* Defer loading of task form templates.


Settings
--------

Moved to settings_.

.. _settings: http://cookiecutter-django.readthedocs.io/en/latest/settings.html

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

Test coverage
^^^^^^^^^^^^^

To run the tests, check your test coverage, and generate an HTML coverage report::

    $ coverage run manage.py test
    $ coverage html
    $ open htmlcov/index.html

Running tests with py.test
~~~~~~~~~~~~~~~~~~~~~~~~~~

::

  $ py.test


Deployment
----------

The following details how to deploy this application.


Heroku
^^^^^^

See detailed `cookiecutter-django Heroku documentation`_.

.. _`cookiecutter-django Heroku documentation`: http://cookiecutter-django.readthedocs.io/en/latest/deployment-on-heroku.html



