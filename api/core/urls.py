# urls.py
from django.urls import path, include
from rest_framework_nested import routers
from .views import PostViewSet, CommentViewSet, RegisterView, ProfileViewSet
from .views import EmailOrUsernameTokenView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register('posts', PostViewSet, basename='post')
router.register('profiles', ProfileViewSet, basename='profile')

posts_router = routers.NestedDefaultRouter(router, 'posts', lookup='post')
posts_router.register('comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
    path('token/', EmailOrUsernameTokenView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]