import requests
import threading
import time

START = 10500001
END   = 11000000
NUM_THREADS = 18
STEP = 1
SLEEP = 0 # seconds, time interval between each request
DISPLAY_INTERVAL = 20 # seconds

next_todo = [0] * NUM_THREADS
threads = []

class BilibiliThread(threading.Thread):
    def __init__(self, threadID, startAV):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.startAV = startAV
        next_todo[threadID] = startAV
   
    def run(self):
        while next_todo[self.threadID] < END:
            print ("Starting thread", self.threadID)
            workAllocator(self.threadID, next_todo[self.threadID])
            print ("Exiting thread", self.threadID)

class MonitorThread(threading.Thread):
    def run(self):
        width = max(len(str(END)), 3)
        for i in range(NUM_THREADS):
            print('|T{:02}'.format(i), end='')
            print(' ' * (width - 3), end='')
        print('| Speed')
        temp = sum(next_todo)
        while threading.active_count() > 2:
            buf = next_todo[:]
            for todo in buf:
                print(('|{:' + str(width) + '}').format(todo), end='')
            speed = (sum(buf) - temp) / (DISPLAY_INTERVAL * STEP * NUM_THREADS)
            print('|', speed, 'av/s')
            temp = sum(buf)
            
            global SLEEP
            if speed > 49:
                SLEEP += 0.1
            if SLEEP > 0 and speed < 30:
                SLEEP = max(0, SLEEP - 0.1)
            time.sleep(DISPLAY_INTERVAL)

def workAllocator(threadID, startAV):
    av = startAV
    while av <= END:
        rs = getVideoInfo(av)
        if type(rs) == int:
            print(threadID, av, 'ERROR:', rs)
            if rs == 403:
                global SLEEP
                SLEEP += 0.2 / NUM_THREADS
                print('Sleeping now for 4000 seconds. SLEEP set to {:.2}'.format(SLEEP))
                time.sleep(4000)
            return
        
        file = open(str(START) + '_' + str(threadID) + '.txt', 'a')
        file.write(rs)
        file.close()
        
        index = av - START - threadID * STEP
        denom = NUM_THREADS * STEP * 50
        av += NUM_THREADS * STEP
        next_todo[threadID] = av

        if SLEEP > 0:
            time.sleep(SLEEP)

def getVideoInfo(av):
    url = 'http://api.bilibili.com/archive_stat/stat?aid=' + str(av)
    try:
        r = requests.get(url)
    except Exception as e:
        print(str(e))
        return -1
    if r.status_code == 200:
        json = r.json()
        if type(json) != dict:
            return r.status_code
        elif 'data' in json:
            j = json['data']
            return str(av) + ',' + \
                   str(j['view']) + ',' + str(j['danmaku']) + ',' + \
                   str(j['reply']) + ',' + str(j['favorite']) + ',' + \
                   str(j['coin']) + ',' + str(j['share']) + '\n'
        else:
            return str(av) + '\n'
    else:
        return r.status_code

last_finished = [10581775,10581812,10581705,10581616,10581401,10582158,10581295,10581638,10581801,
                 10581712,10581929,10581750,10581607,10582274,10582077,10581682,10582115,10582026]

for i in range(NUM_THREADS):
    #thread = BilibiliThread(i, START + i * STEP)
    thread = BilibiliThread(i, last_finished[i] + STEP * NUM_THREADS)
    thread.start()
    threads.append(thread)

thread = MonitorThread()
thread.start()

for thread in threads:
    thread.join()

print ("Exiting Main Thread")
