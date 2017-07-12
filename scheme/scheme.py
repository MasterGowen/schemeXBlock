#-*- coding: utf-8 -*-

"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import datetime
import json

import django.utils.translation

from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment

from webob.response import Response

import subprocess


from .utils import (
    load_resource,
    render_template,
    load_resources,
    )


class SchemeXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )


    def is_course_staff(self):
        """
        Проверка, является ли пользователь автором курса.
        """
        return getattr(self.xmodule_runtime, 'user_is_staff', False)

    def is_instructor(self):
        """
        Проверка, является ли пользователь инструктором.
        """
        return self.xmodule_runtime.get_user_role() == 'instructor'


    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def _now():
        """
        Получение текущих даты и времени.
        """
        return datetime.datetime.utcnow().replace(tzinfo=pytz.utc)

    def student_id(self):
        return self.xmodule_runtime.anonymous_student_id

    def student_view(self, context=None):
        """
        The primary view of the SchemeXBlock, shown to students
        when viewing courses.
        """

        fragment = Fragment()
        fragment.add_content(
            render_template(
                "static/html/scheme.html",
                context
            )
        )

        js_urls = (
            "static/js/src/main.js",
            # "static/js/src/loader.js",
            "static/js/src/scheme.js",
            )

        css_urls = (
            "static/css/scheme.css",
            "static/css/dropdown.css",
            "static/css/main.css",
            )

        load_resources(js_urls, css_urls, fragment)

        fragment.initialize_js('SchemeXBlock')
        return fragment

    def studio_view(self, context=None):
        """
        The primary view of the SchemeXBlock, shown to students
        when viewing courses.
        """

        fragment = Fragment()
        fragment.add_content(
            render_template(
                "static/html/scheme.html",
                context
            )
        )

        js_urls = (
            "static/js/src/main.js",
            "static/js/src/loader.js",
            "static/js/src/scheme.js",
            )

        css_urls = (
            "static/css/scheme.css",
            "static/css/dropdown.css",
            "static/css/main.css",
            )

        load_resources(js_urls, css_urls, fragment)

        fragment.initialize_js('SchemeXBlock')
        return fragment

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def spice_handler(self, data, suffix=''):
        data = json.loads(data)
        netlist = data["netlist"]


        stdout = subprocess.check_output(
            'echo "{0}" | ngspice -b'.format(netlist),
            stderr=subprocess.STDOUT,
            shell=True
        )
        stdout = stdout.decode("utf-8").split('\n')
        print(stdout)


        response = Response(body=stdout, content_type='text/plain')

        return response

    icon_class = "problem"

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("SchemeXBlock",
             """<scheme/>
             """),
            ("Multiple SchemeXBlock",
             """<vertical_demo>
                <scheme/>
                <scheme/>
                <scheme/>
                </vertical_demo>
             """),
        ]

