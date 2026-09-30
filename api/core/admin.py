from django.contrib import admin
from django.urls import path, include
from .models import Post, Comment, Profile
# Register your models here.

admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Profile)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]