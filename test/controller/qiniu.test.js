'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';

describe('Controller: qiniu', () => {
  let user = null;
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        username: '123456789',
        password: '123456789'
      });

    assert(user.body.token !== null);
  });
  it('Action: getUploadToken', async () => {
    const result = await request
      .get('/api/auth/uploadToken?fileName=lalala')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: upload', async () => {
    const result = await request
      .post('/api/auth/upload')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .attach('file', '/home/qill/MyProject/order-manage-sys/test/files/404.png')
      .expect(200);

    assert(result.body.fsize > 0);
  });
  it('Action: uploadBase64', async () => {
    const result = await request
      .post('/api/auth/upBase64')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        data: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbkAAADJCAYAAAC+AUxdAAAgAElEQVR4Xu2dB5gUVdaGzyiKqCwKBjDniOKaA2IOYBYTKgZUxLCimMAcF0RBMSIqrqJiwCxiDiPmrJhzBEFQTAii8897d6v/pp3QTNVMn6r+7vP4qFB169R7Tp3v3nNvV1VUVTf7X3vwwQdt+PDhVllZaZMmTYr+WP9OCYGFF17YOnXqZD169LAuXbqkxOr/N1PxlzqXzWKw4i/d/ku79bXFX0Ukcr169bKxY8danz59rHPnztauXbu033PZ2T9+/HgbM2aMDR482Dp27GhDhw5NDQPFX2pcVauhir/0+zDNd1Bb/AWRI8FMnTrVRo4cmeZ7lO15BLp162atWrVKhdAp/rIXuoq/7Pk0TXeUH38Vo0ePrjrppJNs3LhxaboH2VoEgfbt29vAgQNdly4pUSr+inBmCg9R/KXQaRkyOYq/iq5du1axfsM6jlq2CLC+ioiMGjXK7Y3tscceQYQVf25d1GDDFH8NRqcTEyAQxV9F9WJd1Ztvvqk1uASgeuuCGnWHDh1s4sSJ3kzL2bPIIouY4s+te2IZpviLhU8nxyQQxV9FdT/5GyxjdqvTvRGoqKjAwd7Mytnj3T634FJimHf/ercvJW52ayb+lci5dU8yhnl/iL3bl4wXyrcX7/71bl/5Rk4ydy6RS4aj6168P8Te7XPt3BQY592/3u1LgYtdmyiRc+2eZIzz/hB7ty8ZL5RvL979692+8o2cZO5cIpcMR9e9eH+Ivdvn2rkpMM67f73blwIXuzZRIufaPckY5/0h9m5fMl4o3168+9e7feUbOcncedmL3JNPPmlbbLFFMjSd9uL9IfZun1O3psYs7/71bl9qHO3U0LIWua+//tpWWmml8ELqffbZp2gX7bXXXjZkyJA6f1f43Xff2eGHHx5ek9aiRYui+26MA70/xN7tawyflFOf3v3r3b5yipXGuNeyFjmA3njjjXbUUUfZiy++aKuttlq9jD/88ENbd9117aGHHrIjjzzSmjVrljvnzz//tPPOO8922GEH+/LLL23ppZe23377TSJXD1UlmXrDLtUHePevd/tS7XwHxrsQuXvuuccOOugg+/HHHxsNyUcffRReHdW8efO/XePzzz+3hRZayOaff/5Z/u7333+3l19+2RZccMHcnw8bNiy85f+OO+4IArbEEkvYnXfeaZtuuqnNmDHD5plnHpt77rmNX9ovtthi9scff8wihI12g3V07P0hLpV9p512mt1666328ccf10pv1113tWWWWcYuueSSWo9ZYIEF7D//+Y9x7EUXXRT6fOWVV0rhapfXLJV/i4Xh3b5i72N2jyOmids33nijqFOJ6fXWW89+/vnnv+XKojoo0UFlI3K8fHrzzTe377//PqD+5ptvbPHFF68VOwJHmZFv6iGAUdt2222tZ8+exvsWP/nkE1txxRWDOP/jH/8IhzzxxBN28cUX2zXXXBPKmRI5C7wGDRpkLVu2rJF3qZLM22+/HWbczLxraxK5+JmpVP6NLPcaf/HJxutBIheP32yd3RQzuXyRo6yIOO2333527rnn2gcffGD777+/vfTSS8YDSatJ5F5//XXbZptt7Ntvvw2zteuvvz6cz3m0eeed1x5//HE78cQT7amnnpLI/S8KGCzA/Pjjj7dTTjnlb2JX6iRYV7BK5GbrUXY1iImMSXP8xadfew8SucakW9B3ochNnz49fLR11VVXtSuuuCIczQt8+RwLgjLnnHPannvuaRdeeGFu2sxs6pxzzglv3Ge2Nsccc9iOO+5ol19+eRCfmTNnhlkZsyu+m4foUb484ogjrHv37vbPf/4zlBvzGxtTKDnSF0l64403NmyLpvf0//7774eSJTMC3qLPet0JJ5xgjz32mETufzDZpNO3b1/766+/wiDiuOOOm0XskhC5tm3b2ogRI8JGH8rH+IT1Vl7+fPTRR4cZNi+qZpMRm41ohaXFX375JQxQiEfe9ck37hjYLLvssrly5aeffhr6e+GFF6xNmzZ2wQUXBL/XVq4k7rgO1yUusev0008P8Usc8iXjp59+2jbaaKNg0yGHHBLim7I4bfLkybbCCisYG5lY/73sssvCfRJvVAkoH/GMMGijrbLKKsFWONx2220hVjm/NhuieOcju1deeWWocFC54Ftc559/vs0111yxM0ES/o1jRFPEXxz78s/lI8fEX+/evcOg8KuvvgrxhU+vu+66MKhmAH7MMcfYqaeemju1vvxIPMOBfEgeJPcRK3fffXcunxFrPKfsN2ApZq211gofX+a5oRWWKylbnnzyyeF54795Tsh9Bx98cFI4EunHXbmSRMjuRf7N52EQmPfee8/WX399O+uss8ImEda7eAgRoLvuuiuAoHyIY0g2JDZmWwglyYS1l6i988474ScDBBJJg1kcCQaHkuRqa8cee2xwJomNxME6zsorrxwSzr777hsCcvXVVw82SeT+ThFuU6ZMCX/BLDhf7Cj1xn2BNCLHt6N48DfccMPgg8rKyuAT/psHmtk6D/izzz4b7CgUuZ122imUnvEzH5vlAT/77LOD2JFkfvrpp7A5affddw8DLOKFzUccT6zWtCaHaL322mvh75dffvkww995551D3G699dbhnw022CAICg0RJPYRGxgh1MQqx5OgsPn++++3NdZYI8Q7gzSOZVAViRzXwX7spm9srMuGW265JfRDH+uss469+uqr4Rlk8MfAMW4rtchhf2PHX1xG0fmIHMsdxAUx8cUXX9iWW25p1Z9Ds9atW4fBIb6kosSAnn8Xkx9ZLuC7ko888oitueaaYV8Bz8NSSy0V8hnCie/559JLLw3LL4giNrz77rshpxaKHGVgbLn33nvDYI04JWboG5u9NHcix7Z7oDO6ZRMHjZEBjmT0HDXg4hBmZCQyNo+w5kMwR23AgAH2zDPPWPVHYWfhzQ7I/v3728033xwSE4JVl8hxbYSRRMUoHvv23nvvUJpEKNmcwp8jwCQojyLnJeDy7WCWwD8k6yREjocuSsqfffaZLbfccnbDDTfYAQccEC7LCBWBiWbs+SKHjxGw559/Pohk1BBOEg4id9VVV4WRLp8tijYwIZokAEbEhSLHZidmjSQHYjVqxArx+sADD4SEwgidkThrhPyUhRE1QsYsjcEbgzXEkpngr7/+GnbtRo1nYquttgp/HokcAsef83AXYwOCzf299dZbuefnhx9+CFWSpGZyWY+/pO4PkaPSga/nm2++0O2BBx5oY8eODXkqWk4hRollRK++/EhcU8FioE785sch/ZLPrr322jArYwLBIDQ//tkUSE4rFDnWsrEnmjBwTrSHIbIzKS5x+nElcogEyYJRBWXACDbT5U022SSUU6JGUuQBxDk4gYeckTejCEY/iA1/RpJ67rnn/saIGR8CSIKpT+Q4mVkIyXH77bcPJSpKlZROEUs2oDBzJLGQLD2KXFwRiRNknNvYI2lmcoxWWWelMSNjVywDEErINPzDrJ34QqTyRY7ZDKNQYiYaXHHOLrvskitXIqIMqgrjCVFBTAtF7qabbgp9MlrOf+gpeS+6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nxLhHY1ao0sOeFP1RA2ar6PzQUQ+kJgGgYvYKP6aKkoa7zqKv8Zjq57rJ1Bb/OVEji4oHVHHrKystEmTJtXfq45wRYDvQ3Xq1Cmsr3ouUdYGTfHnKpxm2xjF32wj0wkJEqgt/mYRuQSvp65EQAREQAScEfD+k47GwCWRawyq6lMEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMAhAYmcQ6fIJBEQAREQgWQISOSS4aheREAEREAEHBKQyDl0ikwSAREQARFIhoBELhmO6kUEREAERMABgZ49e9qIESNswIAB1rt3b4tEbsiQIda3b1/r3r27DRs2zIGljWdCRVV1a7zu1bMIiIAIiECpCPz888/Wpk0ba9asmbVo0cKmTJlirVu3tmnTptnMmTNt8uTJ1rJly1KZ1yTXlcg1CWZdRAREQARKQ6Bfv342ePBgmzFjRs6Aueee2/r06WP9+/cvjVFNeFWJXBPC1qVEQAREoKkJMJtbeOGFbfr06blLN2/e3CZNmpT5WRw3LJFr6ojT9URABESgiQnkz+bKaRYnkWviQNPlREAERKAUBPJnc+U0i5PIlSLadE0REAERKAEBZnODBg2y448/vizW4iLEKleWINh0SREQARFoagLM5tq2bWsTJkwoi7W4GkXuwQcftOHDh1tlZWVYlFRLFwEWlzt16mQ9evSwLl26pMv4amsVf6lz2SwGK/7S7b+0W19b/OVmcr169bKxY8eGbaWdO3e2du3apf2ey87+8ePH25gxY8J24Y4dO9rQoUNTw0DxlxpX1Wqo4i/9PkzzHdQWf0HkSDBTp061kSNHpvkeZXsegW7dulmrVq1SIXSKv+yFruIvez5N0x3lx1/F6NGjq0466SQbN25cmu5BthZBoH379jZw4EDXpUtKlIq/IpyZwkMUfyl0WoZMjuKvomvXrlWs37COo5YtAqyvIiKjRo1ye2N77LFHEGHFn1sXNdgwxV+D0enEBAhE8VdRvVhX9eabb2oNLgGo3rqgRt2hQwebOHGiN9Ny9iyyyCKm+HPrnliGKf5i4dPJMQlE8VdR3Y/e0RwTpufTvX9aw7t9nn2bBtu8+9e7fWnwsWcb8a9EzrOHErDN+0Ps3b4EXFDWXXj3r3f7yjp4Erh5iVwCEL134f0h9m6fd/96t8+7f73b592/3u2TyHn3UAL2eX+IvduXgAvKugvv/vVuX1kHTwI3L5FLAKL3Lrw/xN7t8+5f7/Z59693+7z717t9EjnvHkrAPu8PsXf7EnBBWXfh3b/e7Svr4Eng5iVyCUD03oX3h9i7fd79690+7/71bp93/3q3TyLn3UMJ2Of9IfZuXwIuKOsuvPvXu31lHTwJ3LxELgGI3rvw/hB7t8+7f73b592/3u3z7l/v9knkqj00Y8YM43PwWW3eH2Lv9sWJiz///NPmnHPOBnfx0EMP2aGHHmpff/116GPDDTcM/88/aWne/evdvsbw82mnnWa33nqrffzxx43Rvas+y17ktthiC9tqq60Mp2e11fUQ8xFFvhI8bNiwkt1+VpPMqquuGr6+vOuuuzaYbdZFTvHX4NCIdeLbb79tX375pe2www6x+knDyWUvcnxzbfvtty87kSO5/Pvf/7ZBgwaFmca0adNKFq9ZFbkVVljBLrroIolc9WuVqt8bOEt8Kf5K9riV3YVTIXJMqy+//HI7//zz7aCDDgolG757x0t9+UTLSy+9FBL1nnvuaRdeeKHNP//8wZH777+/zTPPPHbttdfmHMuM7YUXXgjJZ/PNN7dffvnF5pprLmvevLnddttttt1229nkyZOtb9++xij6t99+s7XWWit8hJQXHdNqs8dr9OSLSJRcLr744pB44MZso3fv3iUzv5Qid8MNNwSxpxy4ySabhFhZaqmlAotPP/3UjjvuOKusrAzxcdhhh9lZZ50VmL3yyitBvO6++247+uijjZExsUN/nEdswZr4I76Iqauuuiqct+mmm4bZM9fiCwxPPPGE9evXL3zqaokllrCzzz7b9tlnn2BDfTM57D7mmGPCx47huN9++9mAAQNC+Z3+dtxxR7vjjjts7733DqP2yy67rMn9rPirGzlxcvLJJ9udd94ZYmbZZZe1E044wQ4++ODcifjyxBNPtNdeey08t3zUmpzUpk2bcAzfY1xooYWMl52fccYZIZbfffdd++yzz3J9TJ8+3RZddNGQL++7776Qx4hH2l9//RUGvFdffbV9++23tvbaa9sVV1yRy3n15UT6wJ4rr7zSvvnmm2AL33MjZxP/pWypETlEibUzkgNJAoetv/76IekcddRRxtumgbrYYovZXXfdVa/IPfbYY+GYwpnc77//buuss07459JLL7V//OMfNmTIkOAsgoYgIjgK7VluueVK6cc6r42Tf/rpp5DMI3GDJa1169YhAZeylUrk+PwQwkW8rLnmmmE2/9Zbb9mzzz4bPiC8+uqr2wEHHGCnnHKKff7550HUGGRxHMlhm222CbF4wQUX2Lzzzhvir1OnTkFkaIUzOQZqXItERtwSe++9914ol48YMSIkLuISgePr7vRVl8hhI3aTDBns/frrr2GgR+ySsEiMCNviiy9uhx9+uG255Za25JJLNrmrFX91I+/Zs2cQr3vvvdeqvwhj99xzj3Xv3j3EAD4jRhjYn3feecaxPLv4kwEOA7BI5Cg/fv/990HkyFMbbLBBiOWNN944HEP/5557bohd8le+yHHO9ddfH4R2pZVWCn/PZ2o++eSTMHiqLyfecsstdsQRR4T45dhXX33V9tprr3Af55xzTpPHXP4FUyNyJJAHHnggV0Pmwcb5zMqiRqAAmIebBFXXTK42kWN0zagK0czfjMLH90hwjLAIjkJ7SurFei6Ok0nCf/zxR/jHYyssZzWFjYx2t9566zBzojFrR7j4/h4zMh70L774IjzkNGb6DKgmTJhgb7zxhq233nphBkU/NEbBVBieeuqpWkXu2GOPDYv9yyyzTDhm9913t/nmmy+IXNRIFsQfya4ukbvkkktCYqKiETWSGmLJwOWDDz6wNdZYI9wLYl2qpvirmzwDERjh72bNmoWDJ02aFGZD/Dl5jAHN/fffn+sIMUMQX375ZVt33XXDTO6mm24KVQQE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sVH8NVWUNN51FH+Nx1Y910+gtvjLiRxdUDqijsk3tfiyrFq6CFRvIgofA+U7aJ5LlLVRVfylK94KrVX8pdt/abe+tvibReTSfpPF2K8tw8VQ0jEiIAIikA0CErls+FF3IQIiIAIiUAMBiZzCQgREQAREILMEJHKZda1uTAREQAREQCKnGBABERABEcgsAYlcZl2rGxMBERABEZDIKQZEQAREQAQyS0Ail1nX6sZEQAREQAQkcooBERABERCBzBKQyGXWtboxERABERABiZxiQAREQAREILMEJHKZda1uTAREQAREQCKnGBABERABEcgsAYlcZl2rGxMBERABEZDIKQZEQAREQAQyS0Ail1nX6sZEQAREQAQkcooBERABERCBzBKQyGXWtboxERABERABiZxiQAREQAREILMEJHKZda1uTAREQAREQCKnGBABERABEcgsAYlcZl2rGxMBERABEZDIKQZEQAREQAQyS0Ail1nX6sZEQAREQAQkcooBERABERCBzBKQyGXWtboxERABERABiZxiQAREQAREILMEJHKZda1uTAREQAREQCKnGBABERABEcgsAYlcZl2rGxMBERABEZDIKQZEQAREQAQySyDzItezZ08bMWKEDRgwwHr37m0VFRVWVVVlQ4YMsb59+1r37t1t2LBhmXWwbkwEREAEyplA5kXu559/tjZt2lizZs2sRYsWNmXKFGvdurVNmzbNZs6caZMnT7aWLVuWcwzo3kVABEQgswQyL3J4rl+/fjZ48GCbMWNGzpFzzz239enTx/r3759Z5+rGREAERKDcCZSFyDGbW3jhhW369Ok5fzdv3twmTZqkWVy5PwG6fxEQgUwTKAuRK5zNaRaX6ZjWzYmACIhAjkDZiFz+bE6zOD0BIiACIlAeBMpG5KLZ3KBBg+z444/XWlx5xLfuUgREoMwJlJXIMZtr27atTZgwQWtxZR74un0REIHyIDCLyD344IM2fPhwq6ysDJsy1NJFgM01nTp1sh49eliXLl3SZbysFQEREIFGIJATuV69etnYsWPDtvrOnTtbu3btGuFy6rIxCYwfP97GjBkTfi7RsWNHGzp0aGNeTn2LgAiIgHsCQeQQuKlTp9rIkSPdGywDiyPQrVs3a9WqlYSuOFw6SgREIKMEKkaPHl110kkn2bhx4zJ6i+V7W+3bt7eBAweqdFm+IaA7F4GyJ1DRtWvXKtZvWMdRyxYB1ldZZx01alS2bkx3IwIiIAJFEqio3qxQ9eabb2oNrkhgaTqMNboOHTrYxIkT02S2bBUBERCBxAhUVPfEslxiHaojXwSiry74skrWiIAIiEDTEJDINQ3nkl1FIlcy9LqwCIiAAwISOQdOaEwTJHKNSVd9i4AIeCcgkfPuoZj2SeRiAtTpIiACqSYgkUu1++o3XiJXPyMdIQIikF0CErns+jbcmUQu4w7W7YmACNRJQCKX8QCRyGXcwbo9ERABiVw5x4BErpy9r3sXARHQTC7jMSCRy7iDdXsiIAKayRUbAzNnzrS55prLRowYYfvvv3+xp7k+TiLn2j0yTgREoJEJaCaXB5g3v9x222220UYb2dJLL93I6Jume4lc03DWVURABHwSkMj59EtiVknkEkOpjkRABFJIIFMixxv3+WDou+++a7/++qstu+yy1r9///ARWNrmm29u++67r33xxRd29dVXh+31hx56qJ133nk255xzhmPmn39+u/XWW23HHXdMoTv/brJELhNu1E2IgAg0kEBmRI4vKWywwQZBoHbeeeeAY9iwYca38iZMmGDzzjtvELkffvjBdt11VzvooIPsrbfesu7du1vfvn3tlFNOkcg1MIh0mgiIgAh4JZAZkfvtt9/CDG3VVVedhXWLFi2ssrLS1ltvvSByiyyyiN1+++25Y04//XS77rrr7JtvvgkzO83kvIaq7BIBERCB2SeQGZHj1p955hm74oor7PXXXw8zNkqQ3333nT300EO27bbbBpHjn7POOitH6r777rNddtklHIcASuRmP4h0hgiIgAh4JZAZkXvyySeDkFGePPzww22JJZawOeaYw+abbz678847bfvtt69R5B544AHbaaedgigusMACEjmvkSq7REAERKABBDIjckceeaS9+OKL9uqrr+YwvPfee7baaqvZmDFjciJX/SV0u+OOO3LHMKu75pprQrmSpplcA6JIp4iACIiAUwKZEbnLLrvMLrjgAmMDSps2bezHH3+0Aw880B599FEbNWqUdenSJczk3njjjVCuZOMJ/73bbrvZ2Wefbcccc4xEzmmQyiwREAERaCiBzIgcbytBrO6++25r2bJlmJHx/z169LBTTz017KJE5DbeeONQmrz55putVatW1rNnz/D3lDY1k2toGOk8ERABEfBJIDMiVwzemjaeFHNemo/R7+TS7D3ZLgIiEJeARC4uQefnS+ScO0jmiYAINCoBiVyj4i195xK50vtAFoiACJSOQFmJXOkwl+7KErnSsdeVRUAESk9AIld6HzSqBRK5RsWrzkVABJwTkMg5d1Bc8yRycQnqfBEQgTQTkMil2XtF2C6RKwKSDhEBEcgsAYlcZl373xuTyGXcwbo9ERCBOglI5DIeIBK5jDtYtycCIlC3yFW/y7GKV2G1a9dOqDJGYPz48dahQwebOHFixu5MtyMCIiACxRGo6Nq1axXvdeT1V2rZIjB8+HDja+m8u1NNBERABMqRQMXo0aOr+DzNuHHjyvH+M33P7du3t4EDB4aXU6uJgAiIQDkSqKiqbr169bKpU6fayJEjy5FBJu+5W7du4QXUQ4cOzeT96aZEQAREoBgCQeQ4EKEbO3as9enTxzp37qw1umLoOTuGNTi+nTd48GDr2LGjBM6Zf2SOCIhA0xPIiRyXZv2GdZzKykqbNGlS01ujK8YiwAdhO3XqFNZXVaKMhVIni4AIZITA/wF4qRJ4KxHa1wAAAABJRU5ErkJggg==`
      })
      .expect(200);

    assert(result.body.fsize > 0);
  });
});
