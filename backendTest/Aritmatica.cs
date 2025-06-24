public class Arimetica
{
    public int Sumar(int a, int b)
    {
        if (a < 0 || b < 0)
        {
             return 0;
        }
        if (a + b < 0)
        {
            return 0;
        }
        return a + b;
    }
    
}
