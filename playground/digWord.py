import jieba
import jieba.posseg as pseg

jieba.enable_paddle()
jieba.initialize()

def getWordList(sentence:str):
  print('harold')
  word_list1 = jieba.cut_for_search("小明硕士毕业于中国科学院计算所，后在日本京都大学深造")
  word_list2 = jieba.cut_for_search(sentence)
  for i in word_list1:
    print(i)
  for i in word_list2:
    print(i)
  print(sentence)

getWordList("一键三连")

''' for word, flag in word_list1:
    print('%s %s' % (word, flag))
  for word, flag in word_list2:
    print('%s %s' % (word, flag))'''