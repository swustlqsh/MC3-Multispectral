from flask import Flask, render_template
app = Flask(__name__)

@app.route('/page')
def page():
    return render_template('ftest/index.html')

if __name__ == '__main__':
    app.run()