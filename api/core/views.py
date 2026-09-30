from django.shortcuts import render
from .models import Post, Comment, Profile
from .serializers import PostSerializer, CommentSerializer, PostDetailSerializer, ProfileSerializer
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EmailOrUsernameTokenSerializer
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from .permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class EmailOrUsernameTokenView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    http_method_names = ['get', 'patch', 'head', 'options']
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'

    @action(detail=True, methods=['get'])
    def liked_posts(self, request, username=None):
        profile = self.get_object();
        posts = Post.objects.filter(likes=profile.user).order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Post.objects.all().order_by("-created_at")
        username = self.request.query_params.get("user")
        if username:
            queryset = queryset.filter(user__username=username)
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            liked = True
            post.likes.add(user)

        return Response({
            'liked': liked,
            'likes_count': post.likes.count()
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def bookmark(self, request, pk=None):
        post = self.get_object()
        user = request.user

        if user in post.bookmarks.all():
            post.bookmarks.remove(user)
            bookmarked = False
        else:
            bookmarked = True
            post.bookmarks.add(user)

        return Response({
            'bookmarked': bookmarked,
            'bookmarks_count': post.bookmarks.count()
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def bookmarks(self, request):
        posts = Post.objects.filter(bookmarks=request.user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk']).order_by('-created_at')
    
    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['post_pk'])
        serializer.save(user=self.request.user, post=post)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def bookmark(self, request, pk=None, post_pk=None):
        comment = self.get_object()
        user = request.user

        if user in comment.bookmarks.all():
            comment.bookmarks.remove(user)
            bookmarked = False
        else:
            comment.bookmarks.add(user)
            bookmarked = True
        return Response({
        "bookmarked": bookmarked,
        "bookmarks_count": comment.bookmarks.count()
    }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None, post_pk=None):
        comment = self.get_object()
        user = request.user

        if user in comment.likes.all():
            comment.likes.remove(user)
            liked = False
        else:
            comment.likes.add(user)
            liked = True
        return Response({
        "liked": liked,
        "likes_count": comment.likes.count()
    }, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
       permission_classes = [permissions.IsAuthenticated]

       def post(self, request):
           try:
               refresh_token = request.data["refresh"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
           except Exception:
               return Response(status=status.HTTP_400_BAD_REQUEST)