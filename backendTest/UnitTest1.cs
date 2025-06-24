namespace backendTest;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test1()
    {
        Assert.Pass();
    }
    [TestFixture]
    public class Pruebasuma
    {
        [Test]
        public void Sumar_ConDosNumerosPositivos_RetornaSuma()
        {
            // Arrange
            var aritmetica = new Arimetica();
            int a = 5;
            int b = 10;

            // Act

            // Assert
            Assert.That(aritmetica.Sumar(a, b), Is.EqualTo(15));
        }

    }
    [Test]
    public void Sumar_ConDosNumerosNegativos_RetornaSuma()
    {
        // Arrange
        var aritmetica = new Arimetica();
        int a = -5;
        int b = -10;

        // Act

        // Assert
        Assert.That(aritmetica.Sumar(a, b), Is.EqualTo(0));
    }
}
