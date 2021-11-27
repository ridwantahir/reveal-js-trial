### Code Full Screen

<div class="grid-parent" style="--num-cols:1;">

<div style="--ch-width:95vw;--ch-height:85vh">

<pre><code class="python" data-line-numbers="17-21|23-26|31|31-39|42|56-63">

"""
Commerce views
"""


import logging

from django.contrib.auth.models import User  # lint-amnesty, pylint: disable=imported-auth-user
from django.http import Http404
from edx_rest_api_client import exceptions
from edx_rest_framework_extensions.auth.jwt.authentication import JwtAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.djangoapps.course_modes.models import CourseMode
from common.djangoapps.util.json_request import JsonResponse
from openedx.core.djangoapps.commerce.utils import ecommerce_api_client
from openedx.core.lib.api.authentication import BearerAuthentication
from openedx.core.lib.api.mixins import PutAsCreateMixin

from ...utils import is_account_activation_requirement_disabled
from .models import Course
from .permissions import ApiKeyOrModelPermission, IsAuthenticatedOrActivationOverridden
from .serializers import CourseSerializer

log = logging.getLogger(__name__)


class CourseListView(ListAPIView):
    """ List courses and modes. """
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CourseSerializer
    pagination_class = None

    def get_queryset(self):
        return list(Course.iterator())


class CourseRetrieveUpdateView(PutAsCreateMixin, RetrieveUpdateAPIView):
    """ Retrieve, update, or create courses/modes. """
    lookup_field = 'id'
    lookup_url_kwarg = 'course_id'
    model = CourseMode
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (ApiKeyOrModelPermission,)
    serializer_class = CourseSerializer

    # Django Rest Framework v3 requires that we provide a queryset.
    # Note that we're overriding `get_object()` below to return a `Course`
    # rather than a CourseMode, so this isn't really used.
    queryset = CourseMode.objects.all()

    def get_object(self, queryset=None):  # lint-amnesty, pylint: disable=arguments-differ, unused-argument
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        course = Course.get(course_id)

        if course:
            return course

        raise Http404

    def pre_save(self, obj):
        # There is nothing to pre-save. The default behavior changes the Course.id attribute from
        # a CourseKey to a string, which is not desired.
        pass


class OrderView(APIView):
    """ Retrieve order details. """

    authentication_classes = (JwtAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticatedOrActivationOverridden,)

    def get(self, request, number):
        """ HTTP handler. """
        # If the account activation requirement is disabled for this installation, override the
        # anonymous user object attached to the request with the actual user object (if it exists)
        if not request.user.is_authenticated and is_account_activation_requirement_disabled():
            try:
                request.user = User.objects.get(id=request.session._session_cache['_auth_user_id'])  # lint-amnesty, pylint: disable=protected-access
            except User.DoesNotExist:
                return JsonResponse(status=403)
        try:
            order = ecommerce_api_client(request.user).orders(number).get()
            return JsonResponse(order)
        except exceptions.HttpNotFoundError:
            return JsonResponse(status=404)
</code></pre>

</div>

</div>

---
### CODE AND DIRTREE FULL SCREEN

<div class="grid-parent" style="--num-cols:2;">

<div data-fragment-index = "1" class="fragment data-dir-tree grid-item-2" style="--ch-width:15vw;--ch-height:70vh" data-dir-tree-path="slides/misc/dir-1.txt" data-dir-tree-active-path="example - 2/day2/tree.css">
</div>

<div class = "fragment" data-fragment-index = "2" style="--ch-width:80vw;--ch-height:70vh">

<pre lang="python"><code data-line-numbers="8-10|30-38|41-67">
"""
Commerce views
"""


import logging

from django.contrib.auth.models import User  # lint-amnesty, pylint: disable=imported-auth-user
from django.http import Http404
from edx_rest_api_client import exceptions
from edx_rest_framework_extensions.auth.jwt.authentication import JwtAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.djangoapps.course_modes.models import CourseMode
from common.djangoapps.util.json_request import JsonResponse
from openedx.core.djangoapps.commerce.utils import ecommerce_api_client
from openedx.core.lib.api.authentication import BearerAuthentication
from openedx.core.lib.api.mixins import PutAsCreateMixin

from ...utils import is_account_activation_requirement_disabled
from .models import Course
from .permissions import ApiKeyOrModelPermission, IsAuthenticatedOrActivationOverridden
from .serializers import CourseSerializer

log = logging.getLogger(__name__)


class CourseListView(ListAPIView):
    """ List courses and modes. """
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CourseSerializer
    pagination_class = None

    def get_queryset(self):
        return list(Course.iterator())


class CourseRetrieveUpdateView(PutAsCreateMixin, RetrieveUpdateAPIView):
    """ Retrieve, update, or create courses/modes. """
    lookup_field = 'id'
    lookup_url_kwarg = 'course_id'
    model = CourseMode
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (ApiKeyOrModelPermission,)
    serializer_class = CourseSerializer

    # Django Rest Framework v3 requires that we provide a queryset.
    # Note that we're overriding `get_object()` below to return a `Course`
    # rather than a CourseMode, so this isn't really used.
    queryset = CourseMode.objects.all()

    def get_object(self, queryset=None):  # lint-amnesty, pylint: disable=arguments-differ, unused-argument
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        course = Course.get(course_id)

        if course:
            return course

        raise Http404

    def pre_save(self, obj):
        # There is nothing to pre-save. The default behavior changes the Course.id attribute from
        # a CourseKey to a string, which is not desired.
        pass


class OrderView(APIView):
    """ Retrieve order details. """

    authentication_classes = (JwtAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticatedOrActivationOverridden,)

    def get(self, request, number):
        """ HTTP handler. """
        # If the account activation requirement is disabled for this installation, override the
        # anonymous user object attached to the request with the actual user object (if it exists)
        if not request.user.is_authenticated and is_account_activation_requirement_disabled():
            try:
                request.user = User.objects.get(id=request.session._session_cache['_auth_user_id'])  # lint-amnesty, pylint: disable=protected-access
            except User.DoesNotExist:
                return JsonResponse(status=403)
        try:
            order = ecommerce_api_client(request.user).orders(number).get()
            return JsonResponse(order)
        except exceptions.HttpNotFoundError:
            return JsonResponse(status=404)

</code></pre>

</div>

</div>

<p>This is the end of the first chapter</p>
<p>I am glad you made it thus far</p>

---
### Code and Demo Side By Side
Show demo of your code using gif

<div class="grid-parent" style="--num-cols:2;">

<div style="--ch-width:50vw;--ch-height:80vh">

<pre lang="python"><code data-line-numbers="30-38|41-53|70-89">
"""
Commerce views
"""


import logging

from django.contrib.auth.models import User  # lint-amnesty, pylint: disable=imported-auth-user
from django.http import Http404
from edx_rest_api_client import exceptions
from edx_rest_framework_extensions.auth.jwt.authentication import JwtAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.djangoapps.course_modes.models import CourseMode
from common.djangoapps.util.json_request import JsonResponse
from openedx.core.djangoapps.commerce.utils import ecommerce_api_client
from openedx.core.lib.api.authentication import BearerAuthentication
from openedx.core.lib.api.mixins import PutAsCreateMixin

from ...utils import is_account_activation_requirement_disabled
from .models import Course
from .permissions import ApiKeyOrModelPermission, IsAuthenticatedOrActivationOverridden
from .serializers import CourseSerializer

log = logging.getLogger(__name__)


class CourseListView(ListAPIView):
    """ List courses and modes. """
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CourseSerializer
    pagination_class = None

    def get_queryset(self):
        return list(Course.iterator())


class CourseRetrieveUpdateView(PutAsCreateMixin, RetrieveUpdateAPIView):
    """ Retrieve, update, or create courses/modes. """
    lookup_field = 'id'
    lookup_url_kwarg = 'course_id'
    model = CourseMode
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (ApiKeyOrModelPermission,)
    serializer_class = CourseSerializer

    # Django Rest Framework v3 requires that we provide a queryset.
    # Note that we're overriding `get_object()` below to return a `Course`
    # rather than a CourseMode, so this isn't really used.
    queryset = CourseMode.objects.all()

    def get_object(self, queryset=None):  # lint-amnesty, pylint: disable=arguments-differ, unused-argument
        course_id = self.kwargs.get(self.lookup_url_kwarg)
        course = Course.get(course_id)

        if course:
            return course

        raise Http404

    def pre_save(self, obj):
        # There is nothing to pre-save. The default behavior changes the Course.id attribute from
        # a CourseKey to a string, which is not desired.
        pass


class OrderView(APIView):
    """ Retrieve order details. """

    authentication_classes = (JwtAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticatedOrActivationOverridden,)

    def get(self, request, number):
        """ HTTP handler. """
        # If the account activation requirement is disabled for this installation, override the
        # anonymous user object attached to the request with the actual user object (if it exists)
        if not request.user.is_authenticated and is_account_activation_requirement_disabled():
            try:
                request.user = User.objects.get(id=request.session._session_cache['_auth_user_id'])  # lint-amnesty, pylint: disable=protected-access
            except User.DoesNotExist:
                return JsonResponse(status=403)
        try:
            order = ecommerce_api_client(request.user).orders(number).get()
            return JsonResponse(order)
        except exceptions.HttpNotFoundError:
            return JsonResponse(status=404)

</code></pre>

</div>

<div style="--ch-width:40vw;--ch-height:50vh">

<img src="slides/images/login/login-fail.gif">

</div>

</div>




---
---
### Code and Demo Side By Side
Show demo of your code using gif

<div class="grid-parent" style="--num-cols:3;">

<div style="--ch-width:50vw;--ch-height:50vh">

<pre lang="python"><code data-line-numbers="30-38|41-53|70-89">
"""
Commerce views
"""


import logging

from django.contrib.auth.models import User  # lint-amnesty, pylint: disable=imported-auth-user
from django.http import Http404
from edx_rest_api_client import exceptions
from edx_rest_framework_extensions.auth.jwt.authentication import JwtAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class CourseListView(ListAPIView):
    """ List courses and modes. """
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CourseSerializer
    pagination_class = None

    def get_queryset(self):
        return list(Course.iterator())


class CourseRetrieveUpdateView(PutAsCreateMixin, RetrieveUpdateAPIView):
    """ Retrieve, update, or create courses/modes. """
    lookup_field = 'id'
    lookup_url_kwarg = 'course_id'
    model = CourseMode
    authentication_classes = (JwtAuthentication, BearerAuthentication, SessionAuthentication,)
    permission_classes = (ApiKeyOrModelPermission,)
    serializer_class = CourseSerializer


</code></pre>

</div>

<div style="--ch-width:40vw;--ch-height:50vh">

<img src="slides/images/login/login-fail.gif">

</div>

</div>


Did you enjoy building ?
Glad to hear it.
Next Topic: Libraries


---
### Two code blocks and demo side by side
You can have layout with two code blocks and one demo

<div class="grid-parent" style="--num-cols:3">

<div style="--ch-width:30vw;--ch-height:50vh">

<pre><code class="python">

class A():
    def __init():
        print("Something is here")

    def go_there():
        print("I am going there")

    def comehere():
        print("I am here")

</code></pre>

</div>

<div style="--ch-width:30vw;--ch-height:50vh">

<pre><code class="python">

class A():
    def __init():
        print("Something is here----------------------------------------------------------")

    def go_there():
        print("I am going there")

    def comehere():
        print("I am here")

</code></pre>

</div>

<div style="--ch-width:30vw;--ch-height:50vh">

<img src="slides/images/login/login-fail.gif">

</div>

</div>

<p>The sun looks yellow. it must be fall</p>
<p>It is November After all</p>


---
### Grid of Images with descriptions
You can have layout with image and code grid

<div class="grid-parent" style="--num-cols:3;">

<div style="--ch-width:30vw;--ch-height:30vh">

<p>Login failure<p>
<p> let's investigate </p>

<img src="slides/images/login/login-fail.gif" style="--item-height:15vh;--item-width:15vw">
<p> Problem solved </p>

</div>

<div style="--ch-width:30vw;--ch-height:30vh">

<pre><code class="python">

class A():
    def __init():
        print("Something is here")

    def go_there():
        print("I am going there")

</code></pre>

</div>



<div  style="--ch-width:30vw;--ch-height:30vh">

<img src="slides/images/login/login-fail.gif">

</div>

<div style="--ch-width:30vw;--ch-height:30vh">

<img src="slides/images/login/login-fail.gif">

</div>

<div style="--ch-width:30vw;--ch-height:30vh">

<img src="slides/images/login/login-fail.gif" >

</div>

<div  style="--ch-width:30vw;--ch-height:30vh">

<img src="slides/images/login/login-fail.gif">

</div>

</div>

<p>The sun looks yellow. it must be fall</p>
<p>It is November After all</p>

---
### TABLES

- min Function 
- max Function

<div class="grid-parent" style="--num-cols:2;">

<div class = "fragment" data-fragment-index = "0" style="--ch-width:50vw;--ch-height:50vh">

<pre class="sql"><code>

select b.*, count(*) as agg from student b
where b.year is not null
group by b.year


</code></pre>

</div>

<div data-fragment-index="1" style="--ch-width:45vw;--ch-height:50vh" class="fragment data-file-table" data-file-table-src="slides/misc/tab1.csv" data-file-table-active-rows="3,4" data-file-table-active-cols="3">

</div>

</div>

---
### The Comeback of the Titans

<h4>The 16th Century miracle</h4>
<p>The Titans came to Argentina at the end of the 20th century. Let's comapre</p>

<div class="grid-parent" style="--num-cols:2;">

<div>

<p>They came in 1987</p>
<p>In the lower penisula of Mexico. They are believed to have moved from Africa in precambrean era</p>
<p>At the time, it was considred a ground braking </p>
<img src="slides/images/login/login-fail.gif" style="--item-width:50%; --item-height:50%">
<p>The precambrian era came before the one before it</p>
<p>It is the oldest of all era</p>


</div>


<div>

<ul>
<li>They came in 1987</li>
<li>In the lower penisula of Mexico. They are believed to have moved from Africa in precambrean era</li>
<li>At the time, it was considred a ground braking </li>
</ul>
<img src="slides/images/login/login-fail.gif" style="--item-width:50%; --item-height:50%">
<ul>
<li>The precambrian era came before the one before it</li>
<li>It is the oldest of all era</li>
</ul>

</div>

</div>


---
### The Comeback of the Titans

<h4>The 16th Century miracle</h4>
<p>The Titans came to Argentina at the end of the 20th century. Let's comapre</p>

<div class="grid-parent" style="--num-cols:2;">

<div style="--ch-width:40vw;--ch-height:70vh">

<p>They came in 1987</p>
<p>In the lower penisula of Mexico. They are believed to have moved from Africa in precambrean era</p>
<p>At the time, it was considred a ground braking </p>
<img src="slides/images/login/login-fail.gif" style="--item-width:50%; --item-height:50%">
<p>The precambrian era came before the one before it</p>
<p>It is the oldest of all era</p>


</div>

<div style="--ch-width:45vw;--ch-height:70vh">

<pre><code class="python">

class A():
    def __init():
        print("Something is here")

    def go_there():
        print("I am going there")

    def come_here():
        print("one plus one is always zero")

    def send_email():
        print("Email is sent today at 18th hour of 202091234")

    def gather_stuff():
        print("I am the king of the jubgle. Kneel before me and god. Kneel now")
</code></pre>

</div>

</div>


---
### The Comeback of the Titans

<h4>The 16th Century miracle</h4>
<p>The Titans came to Argentina at the end of the 20th century. Let's comapre</p>

<div class="grid-parent" style="--num-cols:2;">

<div style="--ch-width:45vw;--ch-height:70vh">

<pre><code class="python" data-line-numbers="|2-4|5-7|8-10|11-13|14-16" data-fragment-index="1">
class A():
    def __init():
        print("Something is here")

    def go_there():
        print("I am going there")

    def come_here():
        print("one plus one is always zero")

    def send_email():
        print("Email is sent today at 18th hour of 202091234")

    def gather_stuff():
        print("I am the king of the jubgle. Kneel before me and god. Kneel now")
</code></pre>

</div>

<div>

<ul>
<li>They came in 1987</li>
<li>In the lower penisula of Mexico. They are believed to have moved from Africa in precambrean era</li>
<li>At the time, it was considred a ground braking </li>
</ul>
<ul>
<li class="fragment" data-fragment-index="1">The precambrian era came before the one before it</li>
<li class="fragment" data-fragment-index="2">It is the oldest of all era</li>
<li class="fragment" data-fragment-index="3">Since then, they continued to inhibit the upper plateau of the mid eastern united states</li>
<li class="fragment" data-fragment-index="4">This is according to recent findings from the University of Pennsylvania</li>
<li class="fragment" data-fragment-index="5">This is according to recent findings from the University of Pennsylvania</li>
</ul>

</div>

</div>

---
<p class="fragment grow">grow</p>
<p class="fragment shrink" data-fragment-index="1">shrink</p>
<p class="fragment fade-out" data-fragment-index="2">fade-out</p>
<p class="fragment fade-up" data-fragment-index="3">fade-up (also down, left and right!)</p>
<p class="fragment fade-in-then-out" data-fragment-index="4">fades in, then out when we move to the next step</p>
<p class="fragment fade-in-then-semi-out" data-fragment-index="5">fades in, then obfuscate when we move to the next step</p>
<p class="fragment highlight-current-blue" data-fragment-index="6">blue only once</p>
<p class="fragment highlight-red" data-fragment-index="7">highlight-red</p>
<p class="fragment highlight-green" data-fragment-index="8">highlight-green</p>
<p class="fragment highlight-blue" data-fragment-index="9">highlight-blue</p>

---
<p class="fragment">grow</p>
<p class="fragment" data-fragment-index="9">shrink</p>
<p class="fragment" data-fragment-index="8">fade-out</p>
<p class="fragment" data-fragment-index="7">fade-up (also down, left and right!)</p>
<p class="fragment" data-fragment-index="6">fades in, then out when we move to the next step</p>
<p class="fragment" data-fragment-index="5">fades in, then obfuscate when we move to the next step</p>
<p class="fragment" data-fragment-index="4">blue only once</p>
<p class="fragment" data-fragment-index="3">highlight-red</p>
<p class="fragment" data-fragment-index="2">highlight-green</p>
<p class="fragment" data-fragment-index="1">highlight-blue</p>