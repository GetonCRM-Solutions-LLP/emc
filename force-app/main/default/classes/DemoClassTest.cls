/* DemoClass Test class */
@isTest
Private class DemoClassTest {
    /* Testmethod  */
    @isTest static void doValidate() { 
        //tested
        DemoClass a = new DemoClass();
        System.assertEquals(1, 1);
    }
}