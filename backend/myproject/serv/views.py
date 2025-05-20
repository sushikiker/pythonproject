from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.contrib.auth import authenticate
from .models import Customer, Product , Order # Добавил User
from .serializers import CustomerSerializer, ProductSerializer, OrderSerializer
from rest_framework import viewsets
@csrf_exempt
def login_customer(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")  # Получаем пароль из запроса

            user = Customer.objects.filter(email=email).first()  # Ищем Customer по email

            if user and user.password == password:  # Проверяем пароль
                user_data = {
                    "name": user.name,
                    "email": user.email,
                    "address": user.address or "Не указан",
                    "age": user.age or "Не указан",
                    "paymentMethod": user.paymentMethod or "Не бубу"
                }
                return JsonResponse({"message": "Данные получены", "user": user_data}, status=200)
            else:
                return JsonResponse({"error": "Неверный email или пароль"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Метод не поддерживается"}, status=405)

@api_view(["GET"])
@permission_classes([IsAuthenticated])

def profile_view(request):
    user = request.customer  # Это объект User

    try:
        customer = Customer.objects.get(email=user.email)  # Ищем Customer по email
        user_data = {
            "name": customer.name,
            "email": customer.email,
            "address": customer.address or "Не указан",
            "age": customer.age or "Не указан",
            "orders": ["Пицца Маргарита - 1 шт.", "Суши Филадельфия - 2 шт."],  # Можно заменить на реальные заказы
            "paymentMethod": customer.paymentMethod or "Не бубу"
        }
        return Response(user_data)
    except Customer.DoesNotExist:
        return Response({"error": "Профиль клиента не найден"}, status=404)


class RegisterCustomerView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.customer
            serializer = CustomerSerializer(data=data)

            if serializer.is_valid():
                customer = serializer.save()

                return Response(
                    {"message": "Пользователь зарегистрирован", "id": customer.id},
                    status=status.HTTP_201_CREATED
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def update_profile(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")  # Берем email из данных запроса
            
            if not email:
                return JsonResponse({"error": "Email не указан"}, status=400)

            user = Customer.objects.filter(email=email).first()  # Ищем пользователя
            if not user:
                return JsonResponse({"error": "Пользователь не найден"}, status=404)

            # Обновляем данные пользователя
            user.name = data.get("name", user.name)
            user.address = data.get("address", user.address)
            user.age = data.get("age", user.age)
            user.paymentMethod = data.get("paymentMethod", user.paymentMethod)

            if data.get("password"):  # Если указан новый пароль
                user.password = data["password"]  # Хеширование пароля нужно добавить отдельно

            user.save()

            return JsonResponse({"message": "Профиль успешно обновлён"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Некорректный JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Метод не поддерживается"}, status=405)


from django.utils.decorators import method_decorator
@method_decorator(csrf_exempt, name='dispatch')
class CreateOrder(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
           

            serializer = OrderSerializer(data=data)
            if serializer.is_valid():
                order = serializer.save()
                return Response(
                    {"message": "Заказ создан", "order_id": order.id},
                    status=status.HTTP_201_CREATED
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from datetime import timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
@csrf_exempt
@permission_classes([AllowAny])
def get_recent_orders(request):
    try:
        # Используй request.data, DRF сам парсит JSON тело запроса
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email не указан"}, status=400)

        # Фильтрация заказов за последние 7 дней
        one_week_ago = timezone.now() - timedelta(days=7)
        recent_orders = Order.objects.filter(customer_email=email, created_at__gte=one_week_ago)

        serializer = OrderSerializer(recent_orders, many=True)
        return Response(serializer.data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]  # Отключаем аутентификацию для всех