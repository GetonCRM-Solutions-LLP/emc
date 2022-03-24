global class CSVIterator implements Iterator<string>, Iterable<string>{
   private String m_CSVData;
   private String m_introValue;
   
   public CSVIterator(String fileData, String introValue){
      fileData = fileData.substring(fileData.indexOf('\n')+1);
      m_CSVData = fileData;
      m_introValue = introValue;
   }
   global Boolean hasNext(){
      return m_CSVData.length() > 1 ? true : false;
   }
   global String next(){
      System.debug(' m_CSVData--'+ m_CSVData);
      String row = m_CSVData.subString(0, m_CSVData.indexOf(m_introValue));
      m_CSVData = m_CSVData.subString(m_CSVData.indexOf(m_introValue) + m_introValue.length(),m_CSVData.length());
      return row;
   }
   global Iterator<string> Iterator(){
      return this;
   }
}