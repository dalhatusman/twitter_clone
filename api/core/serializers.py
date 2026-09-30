from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import Profile, Post, Comment
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email = validated_data.get('email', ''),
            username = validated_data['username'],
            password = validated_data['password']
        )

        Profile.objects.create(user=user)
        return user

class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attr):
        login_input = attr.get('username')

        try:
            matched_user = User.objects.get(email=login_input)
            attr['username'] = matched_user.username
        except User.DoesNotExist:
            pass
        return super().validate(attr)

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'full_name', 'bio',  'profile_picture', 'year_created']
        read_only_fields = ['year_created']
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
        

class MiniProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'profile_picture', 'full_name']

class CommentSerializer(serializers.ModelSerializer):
    profile = MiniProfileSerializer(source="user.profile", read_only=True)
    likes_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'profile', 'likes_count', 'bookmarks_count', 'is_bookmarked', 'is_liked', 'text', 'created_at']
        read_only_fields = ['post', 'user', 'created_at']

    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_bookmarks_count(self,obj):
        return obj.bookmarks.count()
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(id=request.user.id).exists()
        return False
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class PostSerializer(serializers.ModelSerializer):
    profile = MiniProfileSerializer(source='user.profile', read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'profile', 'text', 'image', 'likes_count', 'is_liked', 'is_bookmarked', 'bookmarks_count','comments_count', 'created_at']
        read_only_fields = ['user', 'created_at']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_bookmarks_count(self,obj):
        return obj.bookmarks.count()
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(id=request.user.id).exists()
        return False
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class PostDetailSerializer(PostSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ['comments']
